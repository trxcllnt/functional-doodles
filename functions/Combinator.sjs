/**
 * Combinators are functions which can only operate on their parameters.
 */

var slice = Array.prototype.slice,
    sweet = require('sweet.js'),
    Lambda = require("./Lambda");

function Combinator(source) {
    source = Lambda.create(source);
    Lambda.call(this, function() {
        return source.call.apply(source, arguments);
    });
}

Combinator.prototype = Object.create(Lambda.prototype);

Combinator.create = function(source) {
    
    if(typeof source === "function") {
        source = source.toString();
        var lParen = source.indexOf("(") + 1,
            rParen = source.indexOf(")", lParen),
            lBrace = source.indexOf("{", rParen) + 1,
            rBrace = source.lastIndexOf("}"),
            args   = source.substring(lParen, rParen),
            body   = source.substring(lBrace, rBrace);
        source = new Function(args, body);
    }
    
    return new Combinator(source);
}

Combinator.demo = function() {
    
    console.log(
        "", "Combinators are a special subset of Functions.",
        "Unlike Lambdas, they don't inherit knowledge of their environment.",
        "They only know what you tell them.",
        "Some common Combinators are..."
    );
    
    var identity = Lambda.create(function(x) {
        return x;
    });

    console.log(
        "", "Identity - Combinator that always returns the thing you give it:",
        "    let identity = (x) => { return x; }",
        identity.call(15), ""
    );

    var constant = Combinator.create(function(id) {
        return Combinator.create(id);
    });

    // Get a Function that always returns 15
    var fifteen = identity.partial(15);

    console.log(
        "Constant - Combinator created by partially applying the Identity Combinator:",
        "    let constant = (id) => { return () => { return x; } }",
        "    let fifteen = identity.partial(15)",
        fifteen.call(5), ""
    );

    var selector = Combinator.create(function(person) {
        return person.name;
    });
    
    var filter = Combinator.create(function(person) {
        return person.isSpartacus || true;
    });
    
    console.log(
        "Selector - Combinator that converts type A into type B:",
        "    let selector = (person) => { return person.name; }",
        selector.call({name:"Malcom Reynolds"}), "",
        "    let filter   = (person) => { return person.isSpartacus || true; }",
        filter.call({isSpartacus: false}),
        filter.call({isSpartacus: true}), ""
    );
}

module.exports = Combinator;