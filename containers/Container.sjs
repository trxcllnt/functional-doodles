var slice = Array.prototype.slice,
    sweet = require('sweet.js'),
    Lambda = require("../functions/Lambda");

function Container(value) {
    Lambda.call(this, function() {
        return value;
    });
}

Container.prototype = Object.create(Lambda.prototype);

Container.create = function(value) {
    return new Container(value);
}
Container.prototype.create = Container.create;

Container.prototype.map = function(selector) {
    return Container.create(selector.call(this.call()));
}

Container.prototype.applyMap = function(selectors) {
    var value = this.call(),
        i = -1, n = selectors.length;
    while(++i < n) {
        value = selectors[i].call(value);
    }
    return Container.create(value);
}

Container.prototype.flatMap = function(selector) {
    return selector.call(this.call());
}

Container.demo = function(Functor) {
    
    if(!Functor) {
        Functor = Container.create(5);
        console.log(
            "", "Containers are wrappers around values. Containers follow two important rules:",
            "  - They must define a way to create them from a value.",
            "  - They must define a way to retrieve that value.",
            "",
            "This Container is essentially identical to the 'constant' Combinator.",
            ""
        );
        
        console.log(
            "Functors are special kinds of Containers. In addition to the two standard Container rules,",
            "Functors must also follow a third rule:",
            "  - Functors must define a way to create a new Functor, whose contents are the result of",
            "    performing an operation on its contents.",
            "",
            "In other words, Functors define a function called `map` that accepts a function which",
            "will operate on its data. Each Functor defines its own version of `map` so it can determine",
            "how best to call the selector and construct the resulting Functor.",
        );
    }
    
    var add = Lambda.create(function(a, b) {
        return a + b;
    });
    var multiply = Lambda.create(function(a, b) {
        return a * b;
    });
    
    var addTen = add.call(10),
        addThirty = add.call(30),
        divideByFour = multiply.call(0.25),
        divideByTwo = multiply.call(0.5);
    
    if(Functor.map) {
        var functorWith10 = Functor.map(addTen);
        console.log(
            "", "Take a look at what this Functor does when I pass it a function that adds 10 to its values.",
            "", "The Functor's original contents:",
            Functor.call(), "",
            "    let functorWith10 = Functor.map(addTen)",
            functorWith10.call(), ""
        )
    }
    
    if(Functor.applyMap) {
        var appWith30CutIn4ths = Functor.applyMap([addThirty, divideByFour])
        console.log(
            "Oh look, an Applicative Functor!",
            "Applicative Functors work just like Functors, except they have a method called `applyMap`.",
            "",
            "Here's the difference:",
            " - Functor's `map` only accepts one selector to apply.",
            " - Applicative's applyMap accepts multiple selectors to apply.",
            "",
            "The Functor's original contents:",
            Functor.call(),
            "    let appWith30CutIn4ths = Functor.applyMap([addThirty, divideByFour])",
            appWith30CutIn4ths.call(), ""
        );
    }
    
    if(Functor.flatMap) {
        var monadRandomFlatMap = Functor.flatMap(Lambda.create(function(i) {
            return Functor.create(Math.round(i * Math.random() * 100));
        }));
        console.log(
            "A wild Monad has appeared!",
            "Monads are a special kind of Applicative Functor, and they define a method called flatMap.",
            "`flatMap` is similar to Functor's `map`, except instead of returning a raw value, it",
            "returns a value wrapped in a Monad.",
            "    let monadRandomFlatMap = Functor.flatMap(Lambda.create((i) => {",
            "        return Functor.create(Math.round(i * Math.random() * 100));",
            "    }));",
            monadRandomFlatMap.call(), ""
        )
    }
}

module.exports = Container;