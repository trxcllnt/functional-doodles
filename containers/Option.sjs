var slice = Array.prototype.slice,
    sweet = require('sweet.js'),
    Container = require("./Container");

function Option(valueOrUndefined) {
    Container.call(this, valueOrUndefined);
}

Option.prototype = Object.create(Container.prototype);

Option.create = function(valueOrUndefined) {
    return new Option(valueOrUndefined);
}
Option.prototype.create = Option.create;

Option.prototype.map = function(selector) {
    var value = this.call();
    return value === undefined ?
        this :
        Option.create(selector.call(value));
}

Option.prototype.applyMap = function(selectors) {
    var value = this.call(),
        i = -1, n = selectors.length;
    if(value === undefined) {
        return this;
    }
    while(++i < n) {
        value = selectors[i].call(value);
    }
    return Option.create(value);
}

Option.prototype.flatMap = function(selector) {
    var value = this.call();
    return value === undefined ?
        this :
        selector.call(value);;
}

Option.demo = function() {
    Container.demo(Option.create(25));
    Container.demo(Option.create(undefined));
}

module.exports = Option;