var fs = require('fs'),
    argv = require('optimist').argv,
    sweet = require('sweet.js');

sweet.loadMacro("./console.sjs");

if(argv._.length === 0) {
    argv._.push(
        "functions/Lambda.sjs",
        "functions/Combinator.sjs",
        "containers/Container.sjs",
        "containers/Option.sjs",
        "containers/List.sjs"
    );
}

argv._.map(function(path) {
    return require("./" + path);
}).forEach(function(Example) {
    Example.demo();
});