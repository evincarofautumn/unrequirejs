#!/usr/bin/env node

var path = require('path');
var fs = require('fs');

var END_SCRIPT = '\n//*/\n';
var SAFE_UNREQUIRE_PATH = path.join(__dirname, '..', 'lib', 'unrequire.js');

var optimist = require('optimist')
    .usage('Usage: $0 [options] scriptFile.js [otherScriptFile.js [...]]\n  Compiles an Unrequire.JS project into one script file')
    .wrap(80)
    .describe({
        'base-url':       'Specify baseUrl require option',
        'cwd':            'Specify cwd require option',
        'config-file':    'Use the given JSON configuration file for the main require call',
        'advanced':       'Derequire using advanced techniques',
        'unrequire-file': 'Path to the Unrequire.JS implementation to include (non-advanced only)'
    })
    .string([ 'base-url', 'cwd', 'config-file', 'unrequire-file' ])
    .boolean([ 'advanced' ])
    .demand([ 'base-url' ])
    .default({
        'advanced': false,
        'unrequire-file': SAFE_UNREQUIRE_PATH
    });

var args = optimist.argv;

if (!args._.length) {
    optimist.showHelp();
    process.exit(1);
}

var outputUnrequirePath = args['unrequire-file'];

var scriptFiles = args._.map(function (file) {
    return path.resolve(file);
});
//var ignoredModules = args.exclude;

var requireConfig;

if (args['config-file']) {
    requireConfig = JSON.parse(fs.readFileSync(args['config-file'], 'utf8'));
} else {
    requireConfig = { };
}

if (args['base-url']) requireConfig.baseUrl = args['base-url'];
if (args['cwd'])      requireConfig.cwd     = args['cwd'];

function simple(output) {
    var vm = require('vm');

    var sandbox = {
        require: null,
        define: null
    };

    var codes = { };

    function writeCode(name) {
        if (Object.prototype.hasOwnProperty.call(codes, name)) {
            output.write(codes[name] + END_SCRIPT);
            delete codes[name];
        }
    }

    // Super flaky comment regexp
    var commentRe = '//[^\r\n]*';
    // Extra step so we can split up our RE
    commentRe = new RegExp(commentRe, 'g');

    // I know, I know.  This is super flaky.  Sorry.
    var callsRe = '';
    callsRe += '\\b(require|define)[\\s\\r\\n]*\\('; // require or define call
    callsRe += '([\\s\\r\\n]*[\'\"][^,]+,)?';        // Optional first parameter ('name')
    callsRe += '([\\s\\r\\n]*\{[^,]+,)?';            // Optional second parameter ({config})
    callsRe += '([\\s\\r\\n]*\\[[^]*?\\])?';         // Optional dependency list
    // Extra step so we can split up our RE
    callsRe = new RegExp(callsRe, 'g');

    function commentChecker(code) {
        // Mark comment start/ends
        commentRe.lastIndex = 0;
        var comments = [ ];
        var match;
        while ((match = commentRe.exec(code))) {
            comments.push([ match.index, match.index + match[0].length ]);
        }

        return function isCommented(index) {
            var i;
            for (i = 0; i < comments.length; ++i) {
                if (comments[i][0] <= index && index < comments[i][1]) {
                    return true;
                }
            }
            return false;
        };
    }

    function rewriteCalls(code, scriptName, config) {
        var base = path.normalize(config.baseUrl);
        var script = path.resolve(base, scriptName);

        // HACKY HACKY HACK~
        var moduleParts = [ ];
        var baseParts = base.split('/');
        var scriptParts = script.split('/');
        var i;
        for (i = 0; i < baseParts.length; ++i) {
            if (i >= scriptParts.length) {
                // Base path goes further than scriptParts; add ..
                moduleParts.push('..');
            } else if (baseParts[i] === scriptParts[i]) {
                // Matching part; do nothing
            } else {
                // Differing part; ../part
                moduleParts.push('..');
                moduleParts.push(scriptParts[i]);
            }
        }
        for (/* */; i < scriptParts.length; ++i) {
            moduleParts.push(scriptParts[i]);
        }

        var cwd = moduleParts.slice(0, moduleParts.length - 1).join('/');
        var moduleName = moduleParts[moduleParts.length - 1];

        var isCommented = commentChecker(code);

        return code.replace(callsRe, function (call, reqdef, name, config, deps, index) {
            if (isCommented(index)) {
                return call;
            }

            if (name || reqdef === 'require') {
                return call;
            } else {
                // TODO Support custom configs properly (merge)

                return reqdef + '(' + [
                    JSON.stringify('./' + moduleName),
                    JSON.stringify({ cwd: cwd }),
                    deps || '[],'
                ].join(', ');
            }
        });
    }

    function getCalls(code, scriptName) {
        var isCommented = commentChecker(code);

        var calls = [ ];
        var match;
        while ((match = callsRe.exec(code))) {
            if (!isCommented(match.index)) {
                calls.push(match[0] + ', function () { });');
            }
        }

        return calls;
    }

    var un = require(SAFE_UNREQUIRE_PATH);
    un.reconfigure({
        loadScriptSync: function (scriptName, config) {
            var code;
            try {
                code = fs.readFileSync(scriptName, 'utf8');
            } catch (e){
                if (e.code === 'EBADF') {
                    return false;
                } else {
                    throw e;
                }
            }
            code = rewriteCalls(code, scriptName, config);
            codes[scriptName] = code;

            var calls = getCalls(code, scriptName, config);

            calls.forEach(function (call, i) {
                vm.runInNewContext(call, sandbox, scriptName + ':' + i);
            });

            return true;
        },
        userCallback: function (scriptName, data, moduleValues, scriptNames, moduleNames, callback) {
            scriptNames.forEach(writeCode);

            if (scriptName) {
                writeCode(scriptName);
            }

            callback(null, null);
        }
    });

    sandbox.require = un.require;
    sandbox.define = un.define;

    output.write('(function () {' + END_SCRIPT);
    output.write(fs.readFileSync(outputUnrequirePath) + END_SCRIPT);
    un.require(requireConfig, scriptFiles);
    output.write('})();' + END_SCRIPT);

    Object.keys(codes).forEach(function (scriptFile) {
        writeCode(scriptFile);
    });
}

function advanced(output) {
    var vm = require('vm');

    var sandbox = {
        require: null,
        define: null
    };

    function getScriptVariableName(scriptName) {
        // TODO More robust solution
        return scriptName.replace(/[^a-z_$]/ig, '_');
    }

    var un = require(SAFE_UNREQUIRE_PATH);
    un.reconfigure({
        context: sandbox,
        userCallback: function (scriptName, callback, moduleValues, moduleScripts) {
            if (!callback) return;

            var fn = callback.toString();
            var argNames = /\((.*?)\)/.exec(fn)[1].split(/[,\s]+/g);
            var argValues = moduleScripts.map(getScriptVariableName);
            var body = fn.substr(fn.indexOf('{') + 1).replace(/}[\s\r\n]*$/g, '');

            output.write('var ' + getScriptVariableName(scriptName) + ' = ');
            output.write('(function (' + argNames.join(', ') + ') {' + END_SCRIPT);
            output.write(body + END_SCRIPT);
            output.write('})(' + argValues.join(', ') + ');' + END_SCRIPT);

            return null;
        }
    });

    sandbox.require = un.require;
    sandbox.define = un.define;

    output.write('(function () {' + END_SCRIPT);
    un.require(requireConfig, scriptFiles);
    output.write('})();' + END_SCRIPT);
}

var output = process.stdout;

if (args['advanced']) {
    advanced(output);
} else {
    simple(output);
}
