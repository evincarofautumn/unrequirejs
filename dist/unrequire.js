(function(){var e=null;(function(t){var n=function(){function n(e,t){this.id=e;this.a=t}function r(e,t){return S.hasOwnProperty.call(e,t)}function i(e){var t=E.apply(Math,e.map(function(e){return e.length})),n=[],r;for(r=0;r<t;++r)n.push(e.map(function(e){return e[r]}));return n}function s(t,n){function r(){!u&&o===t.length&&(u=!0,s[0]=g(s[0]),n.apply(e,s))}function i(n){t[n].call(e,function(){var e;for(e=0;e<arguments.length;++e)s[e]||(s[e]=[]),s[e][n]=arguments[e];++o;r()})}var s=[],o=0,u=!1,a;for(a=0;a<t.length;++a)i(a);r()}function o(e){for(var e=x.exec(e),t={},n=14;n--;)t[T[n]]=e[n]||"";var r={};t.queryKey=r;t[T[12]].replace(N,function(e,t,n){t&&(r[t]=n)});return t}function u(e,t,n,r,i){return[e&&e+":",t&&"//"+t,n&&n,r&&"?"+r,i&&"#"+i].join("")}function a(t,n){if(/^\.\.?(\/|$)/.test(t))return n.cwd?n.cwd+"/"+t:t;var r=o(t),i=r.path;return!r.protocol&&!r.authority&&!/^[\/\\]/.test(i)?n.baseUrl?n.baseUrl+"/"+u(e,e,i,r.query,r.anchor):u(e,e,i,r.query,r.anchor):t}function f(e,t){return e.map(function(e){return a(e,t)})}function l(t){var r;for(r=0;r<C.length;++r){var i=C[r],s=i.getResourceID(t);if(s!==e)return new n(s,i)}throw Error("No suitable plugin can handle module: "+t)}function c(e){function t(a){n[a]=s;i[a]=s;++s;o.push(a);r(e,a)&&e[a].forEach(function(e){r(n,e)?o.indexOf(e)>=0&&(i[a]=E(i[a],n[e])):(t(e),i[a]=E(i[a],i[e]))});if(i[a]===n[a]){var f=[],l;do l=o.pop(),f.push(l);while(l!==a);u.push(f)}}var n={},i={},s=0,o=[],u=[];Object.keys(e).forEach(function(e){r(n,e)||t(e)});return u}function h(){return c(_).filter(function(e){return e.length>1})}function p(){h().forEach(function(t){t.length!==1&&(t.every(r.bind(e,A))||console.error("Circular dependency detected between the following modules:\n"+t.join("\n")))})}function d(t,n){if(r(A,t))throw Error("Cannot push to "+t+" which already has value "+A[t]);A[t]=n;if(r(O,t)){var i=O[t];delete O[t];i.map(function(t){t(e,n)})}}function v(t,n){r(A,t)?n(e,A[t]):(r(O,t)||(O[t]=[]),O[t].push(n),r(k,t)&&L.indexOf(t)<0&&(L.push(t),(0,k[t])()))}function m(e,t){if(r(k,e))throw Error("Resource "+e+" already announced");r(O,e)?(L.push(e),t()):k[e]=t}function g(e){var t=!1;e&&e.map(function(e){e&&(t=!0)});if(t)return e}function y(e,t){var n=e.cwd;t.cwd&&(n+="/"+t.cwd);var r=e.baseUrl;t.baseUrl&&(r=t.baseUrl);return{cwd:n,baseUrl:r}}function b(e,t,n){e=e.map(function(e){return function(n){v(e.id,n);!r(A,e.id)&&!r(k,e.id)&&L.indexOf(e.id)<0&&!r(M,e.id)&&(M[e.id]=!0,e.a.fetchResource(e.id,t,function(e){if(e)return n(e)}))}});s(e,function(e,t){n(e,t||[])})}function w(e,t){var n=e.map(function(e){return function(t){e[1].a.extractModule(e[0],e[2],t)}});s(n,function(e,n){t(e,n||[])})}var E=Math.min,S={},x=/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,T="source,protocol,authority,userInfo,user,password,host,port,relative,path,directory,file,query,anchor".split(","),N=/(?:^|&)([^&=]*)=?([^&]*)/g,C=[],k={},L=[],A={},O={},M={},_={},D={definePlugin:function(e,t){typeof t=="function"&&(t=t(D));C.push(t)},parseUri:o,buildUri:u,push:d,pull:v,announce:m,parseDefineArguments:function(t){var n=e,r=[],i=E(t.length-1,2),s=t[i],o=0;o<i&&typeof t[o]=="string"&&(n=t[o++]);o<i&&Array.isArray(t[o])&&(r=t[o++].slice());return{name:n,config:{},deps:r,factory:s}},parseRequireArguments:function(t){var n={},r=[],i=e,i=0;S.toString.call(t[i])==="[object Object]"&&(n=t[i++]);Array.isArray(t[i])&&(r=t[i++].slice());i=t[i];return{config:n,deps:r,factory:i}},createDefaultConfiguration:function(){return{baseUrl:"",cwd:"."}},joinConfigurations:y,handleDefine:function(t,n,s){var n=y(n,t.config),o=a(t.name,n),u=l(o),c=t.factory,h=t.deps;m(u.id,function(){var t=f(h,n),o=t.map(l);o.forEach(function(e){var t=u.id,e=e.id;r(_,t)?_[t].push(e):_[t]=[e]});p();b(o,n,function(n,r){if(n)return s(n);w(i([r,o,t]),function(t,n){if(t)return s(t);var r=typeof c=="function"?c.apply(e,n):c;d(u.id,r);s(e)})})})},handleRequire:function(t,n,r){var n=y(n,t.config),s=t.factory,o=f(t.deps,n),u=o.map(l);b(u,n,function(t,n){if(t)return r(t);w(i([n,u,o]),function(t,n){if(t)return r(t);typeof s=="function"&&s.apply(e,n);r(e)})})}};typeof t=="object"&&t?t.unrequire=D:typeof module=="object"&&module&&(module.exports=D);return D}();(function(){if(typeof loadScript!="function"){try{t.document.createElement("script")}catch(r){return}n.definePlugin("browser",function(n){function r(e){if(e)throw e}function i(t,i,s){for(var o;o=t.shift();){o.name===e&&(o.name=i);n.handleDefine(o,s,r)}}function s(t){if(!l)return!1;if(/loaded|complete/.test(a.readyState))return E||(console.warn("Scripts being loaded after document.onload; scripts may be loaded from out-of-date cache"),E=!0),console.warn("Script loaded from possibly out-of-date cache: "+t),!1;var n;try{var r=new XMLHttpRequest;r.open("GET",t,!1);r.send(e);if(h.indexOf(r.status)<0)return!1;n=r.responseText;n+="\n\n//*/\n//@ sourceURL="+t}catch(i){return!1}try{}catch(s){return!1}Function(n)();return!0}function o(t,n){if(c&&s(t))n(e);else{var r=a.createElement("script");r.async=!0;w&&r.setAttribute("data-scriptName",t);r[d]=r[p]=function(){var t;if(!r.readyState||/loaded|complete/.test(r.readyState)){var i=r.parentNode;i&&i.removeChild(r);t=r[d]=r[p]=r[v]=e,r=t;n(e)}};r[v]=function(){n(Error("Failed to load script: "+t))};cacheBust="?"+Math.random()+"_"+Math.random()+"_"+Math.random();r.src=t+cacheBust;a.head.appendChild(r)}}function u(){var t=n.parseDefineArguments(arguments);if(x===1&&t.name)n.handleDefine(t,"(global)",r);else{var i;if(w){e:{i=a.getElementsByTagName("script");var s,o;for(s=0;o=i[s];++s)if(o.readyState==="interactive"){i=o;break e}i=e}i=i.getAttribute("data-scriptName");i=y[i]}else i=b;i.push(t)}}var a=t.document,f=Object.prototype.toString.call(t.opera)==="[object Opera]",l=typeof navigator!="undefined"&&navigator&&/ AppleWebKit\//.test(navigator.userAgent),c=!1,h=[0,200,204,206,301,302,303,304,307],p="onreadystatechange",d="onload",v="onerror",m=n.buildUri,g=n.parseUri,y={},b=[],w=a.all&&!f,E=!1;u.c={};var S,x=0,T=n.createDefaultConfiguration();t.require=function(){var e=n.parseRequireArguments(arguments);n.handleRequire(e,T,r)};t.define=u;++x;return{getResourceID:function(t){var t=g(t),n=t.file.split(".").slice(1),r=t.path;if(n.length){if(n[n.length-1]!=="js")return e}else r+=".js";t=m(t.protocol,t.authority,r,t.b);n=a.createElement("a");n.href=t;return n.href},fetchResource:function(e,r,s){var a=g(e),a=m(a.protocol,a.authority,a.directory).replace(/\/+$/,""),r=n.joinConfigurations(r,{});r.cwd=a;x===0&&(S=t.define);t.define=u;++x;w&&(y[e]=[]);o(e,function(n){--x;if(x<0)throw Error("Bad defineUses state; please report to unrequire developers!");x===0&&(t.define=S);if(n)return s(n);w?i(y[e],e,r):i(b,e,r);s()})},extractModule:function(t,n,r){r(e,t)}}})}})();(function(){n.definePlugin("Spaceport SWF",function(n){var r=n.parseUri,i=n.buildUri;return{getResourceID:function(t){var t=r(t),n=t.file.split(".").slice(1);return n[n.length-1]!=="swf"?e:i(t.protocol,t.authority,t.path,t.query)},fetchResource:function(r,i,s){var o=t&&t.sp;if(o)if(i=o.Loader,o=o.URLRequest,typeof i!="function"||typeof o!="function")s(Error("Spaceport not initialized"));else{var u=new i,a=u.contentLoaderInfo;a.addEventListener("complete",function f(){a.removeEventListener("complete",f);n.push(r,u);s(e)});a.addEventListener("ioError",function l(e){a.removeEventListener("ioError",l);s(Error("Failed to load "+r+": "+e.text));u.destroy(!0)});u.load(new o(r))}else s(Error("Spaceport not initialized; sp object not found on window"))},extractModule:function(t,n,i){if(n=r(n).anchor)try{i(e,t.contentLoaderInfo.applicationDomain.getDefinition(n))}catch(s){i(s)}else i(e,t.content)}}})})();(function(){typeof loadScript=="function"&&n.definePlugin("spaceport",function(n){function r(e){if(e)throw e}function i(){var e=n.parseDefineArguments(arguments);f===1&&e.name?n.handleDefine(e,"(global)",r):u.push(e)}var s=n.parseUri,o=n.buildUri,u=[],a,f=0,l=n.createDefaultConfiguration();t.require=function(){var e=n.parseRequireArguments(arguments);n.handleRequire(e,l,r)};t.define=i;++f;return{getResourceID:function(t){var t=s(t),n=t.file.split(".").slice(1),r=t.path;if(n.length){if(n[n.length-1]!=="js")return e}else r+=".js";return o(t.protocol,t.authority,r,t.b)},fetchResource:function(l,c,h){var d=s(l),d=o(d.protocol,d.authority,d.directory).replace(/\/+$/,""),c=n.joinConfigurations(c,{});c.cwd=d;f===0&&(a=t.define);t.define=i;++f;console.log("loadScript("+l+")");loadScript(l,function(){--f;if(f<0)throw Error("Bad defineUses state; please report to unrequire developers!");f===0&&(t.define=a);for(var i=c,s;s=u.shift();){s.name===e&&(s.name=l);n.handleDefine(s,i,r)}h(e)})},extractModule:function(t,n,r){r(e,t)}}})})()})(window)})();