
/**
 * Functions are the foundation for everything in Functional Programming.
 * Since JavaScript has already claimed the Function function, Lambda is
 * our custom rewrite of Function so we can see its components.
 */

var slice = Array.prototype.slice;

function Lambda(source) {
    this.source = source;
}

Lambda.create = function(source, args) {
    args || (args = []);
    return new Lambda(function() {
        var args2 = args.concat(slice.call(arguments));
        if(args2.length < source.length) {
            return Lambda.create(source, args2);
        }
        return source.apply(null, args2);
    });
}

Lambda.prototype.call = function() {
    return this.source.apply(null, arguments);
}

Lambda.prototype.apply = function() {
    return this.source.apply(null, arguments);
}

Lambda.prototype.partial = function() {
    return Lambda.create(this.source, slice.call(arguments));
}

Lambda.prototype.compose = function() {
    var fns = [this].concat(slice.call(arguments));
    return Lambda.create(function(x) {
        var i = -1, n = fns.length;
        while(++i < n) {
            x = fns[i].call(x);
        }
        return x;
    });
}

Lambda.demo = function() {

    console.log(
        "", "Functions are ways of converting things into other things.", "",
        "Lambdas are unnamed (or anonymous) Functions. Since they aren't named, they can't recurse.",
        "Lambdas inherit knowledge about their environment, This makes Lambdas useful tools for structuring computation.", ""
    );

    var add = Lambda.create(function(a, b) {
        return a + b;
    });
    
    console.log(
        "Execution - talk to your Function. It talks back:",
        add.call(5, 10), ""
    )

    // Functions are only supposed to take one parameter.
    // Can we create functions that take more than one?
    var addTo = Lambda.create(function(a) {
        return Lambda.create(function(b) {
            return add.call(a, b);
        });
    });

    // Sure can, but we use an intermediate function to do it.
    var addFive = addTo.call(5);

    console.log(
        "Currying - Give the function a value, it hands you a Function that remembers that value forever:",
        "    let add = (a, b) => { return a + b; }",
        "    let addTo = (a) => { return (b) => { return add(a, b); } }",
        "    let addFive = addTo.call(5)",
        addFive.call(15), ""
    );

    var addThings = Lambda.create(function(a, b, c) {
        return a + b + c;
    });

    var addFiveAndTenAnd = addThings.partial(5, 10);

    console.log(
        "Partial application - Curry multiple values:",
        "    let addThings = (a, b, c) => { return a + b + c; }",
        "    let addFiveAndTenAnd = addThings.partial(5, 10)",
        addFiveAndTenAnd.call(15), ""
    );

    var autoAddFiveAndTenAnd = addThings.partial(5, 10);

    console.log(
        "Automatic Partial application - Curry multiple values by default:",
        "    let addThings = (a, b, c) => { return a + b + c; }",
        "    let autoAddFiveAndTenAnd = addFiveAnd.call(5, 10)",
        autoAddFiveAndTenAnd.call(15), ""
    );

    var compose = Lambda.create(function(fx, fy, x) {
        var y = fx.call(x);
        var z = fy.call(y);
        return z;
    });

    var intToAlphabet = Lambda.create(function(x) {
        x = Math.round(Math.min(0, Math.max(25, x)));
        var l = [65, 90], h = [97, 122],
            r = Math.random() > 0.5 ? [65, 90] : [97, 122],
            y = "", i = -1, n = 26 - x;
        while(++i < n) {
            y += String.fromCharCode((Math.random() > 0.5 ? l : r)[0] + i);
        }
        return y;
    });
    
    var shuffleAlphabet = Lambda.create(function(x) {
        var y = "", i = -1, n = x.length;
        while(++i < n) {
            y += x[Math.floor(Math.random() * n)];
        }
        return y;
    });

    console.log(
        "Composition - Create a function that hooks two other functions up:",
        "    let intToAlphabet   = (i) => { return getAlphabetFrom(i); }",
        "    let shuffleAlphabet = (x) => { return x.split('').sort(Math.random).join(''); }",
        compose.call(intToAlphabet, shuffleAlphabet, Math.random() * 25), ""
    );

    var intToRandomString = compose.call(intToAlphabet, shuffleAlphabet);

    console.log(
        "Composition + Partial Application = <3",
        "    let intToAlphabet   = (i) => { return getAlphabetFrom(i); }",
        "    let shuffleAlphabet = (x) => { return x.split('').sort(Math.random).join(''); }",
        "    let intToRandomString  = intToAlphabet.compose(shuffleAlphabet)",
        intToRandomString.call(Math.random() * 25),
        intToRandomString.call(Math.random() * 25), ""
    );

}

module.exports = Lambda;
