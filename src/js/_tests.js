/**
 *  Собрать тут мои кастомные функции. Либо перенести их в _functions
 * Добавить функцию в методы элементов
 */



function get(selector) {
    selector = selector || 'body';
    return document.querySelector(selector);
}
function inside(selector) {
    selector = selector || 'body';
    return document.querySelector(selector);
}

// Добавить свой метод к элементам HTML, this = элемент на котором вызывается метод
Element.prototype.get = function(selector) {
    return this.querySelector(selector) || this;
};

console.log(inside('.test').get('.myselect'))