var slice = Array.prototype.slice,
    sweet = require('sweet.js'),
    Container = require("./Container");

function List(list) {
    Container.call(this, list);
}

List.prototype = Object.create(Container.prototype);
List.create = function() {
    return new List(slice.call(arguments));
}
List.prototype.create = List.create;

List.prototype.map = function(selector) {
    var list = this.call(),
        newList = [], i = -1, n = list.length;
    if(list.length === 0) {
        return this;
    }
    while(++i < n) {
        newList[i] = selector.call(list[i]);
    }
    return List.create.apply(null, newList);
}

List.prototype.applyMap = function(selectors) {
    var list = this.call(), newList = [],
        i = -1, n = selectors.length;
    while(++i < n) {
        var selector = selectors[i],
            j = -1, k = list.length;
        while(++j < k) {
            newList[newList.length] = selector.call(list[j]);
        }
    }
    return List.create.apply(null, newList);
}

List.prototype.flatMap = function(selector) {
    var list = this.call(), newList = [],
        i = -1, n = list.length;
    while(++i < n) {
        var result = selector.call(list[i]),
            resultList = result.call(),
            j = -1, k = resultList.length;
        while(++j < k) {
            newList[newList.length] = resultList[j];
        }
    }
    return List.create.apply(null, newList);
}

List.demo = Container.demo.bind(null, List.create(1, 1, 2, 3, 5, 8, 13, 21, 34));

module.exports = List;