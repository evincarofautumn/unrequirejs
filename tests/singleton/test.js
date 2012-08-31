if (typeof module !== 'undefined') require = require('../node-runner')(global);

var globalA = null;
test.step('test1');
require([ 'a', 'b', './a', './b', 'c/c', './c/c' ], function (A, B, A2, B2, C, C2) {
    test.assert(typeof A === 'object' && A !== null, 'A is an object');
    test.assertEqual(A, B);
    test.assertEqual(A, A2);
    test.assertEqual(A, B2);
    test.assertEqual(A, C);
    test.assertEqual(A, C2);

    globalA = A;
    test2();
});

function test2() {
    test.step('test2')
    require([ 'a', 'b', './a', './b', 'c/../a' ], function (A, B, A2, B2, A3) {
        test.assertEqual(A, globalA);
        test.assertEqual(A, B);
        test.assertEqual(A, A2);
        test.assertEqual(A, B2);
        test.assertEqual(A, A3);
        test.done();
    });
}
