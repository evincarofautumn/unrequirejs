if (typeof module !== 'undefined') require = require('../node-runner')(global);

test.step('test1');
require([ 'a' ], function (A) {
    test.assertEqual('A', A);
    test2();
});

function test2() {
    test.step('test2')
    require([ 'b' ], function (B) {
        test.assertEqual('B', B);
        test3();
    });
}

function test3() {
    test.step('test3');
    require([ 'a', 'b' ], function (A, B) {
        test.assertEqual('A', A);
        test.assertEqual('B', B);
        test4();
    });
}

function test4() {
    test.step('test4');
    require([ 'c/c' ], function (C) {
        test.assertEqual('ABC', C);
        test5();
    });
}

function test5() {
    test.step('test5');
    require([ 'c/c', 'a' ], function (C, A) {
        test.assertEqual('ABC', C);
        test.assertEqual('A', A);
        test6();
    });
}

function test6() {
    test.step('test6');
    require([ 'a', 'c/c' ], function (A, C) {
        test.assertEqual('A', A);
        test.assertEqual('ABC', C);
        test7();
    });
}

function test7() {
    test.step('test7');
    require([ 'b' ], function (B) {
        test.assertEqual('B', B);
        test8();
    });
}

function test8() {
    test.step('test8');
    require([ 'a', 'b' ], function (A, B) {
        test.assertEqual('A', A);
        test.assertEqual('B', B);
        test9();
    });
}

function test9() {
    test.step('test9');
    require([ 'c/c' ], function (C) {
        test.assertEqual('ABC', C);
        test10();
    });
}

function test10() {
    test.step('test10');
    require([ 'c/c', 'a' ], function (C, A) {
        test.assertEqual('ABC', C);
        test.assertEqual('A', A);
        test11();
    });
}

function test11() {
    test.step('test11');
    require([ 'a', 'c/c' ], function (A, C) {
        test.assertEqual('A', A);
        test.assertEqual('ABC', C);
        test.done();
    });
}

