/**
 * Собрать тут мои кастомные функции. Либо перенести их в _functions
 * Добавить функцию в методы элементов
 */

function $(selector) {
    if (!selector) {
        console.error('fn _node: Не вказано селектор');
        return null;
    }
    return document.querySelectorAll(selector);
}
// function inside(selector) {
//     selector = selector || 'body';
//     return document.querySelector(selector);
// }

// Добавить свой метод к элементам HTML, this = элемент на котором вызывается метод
// Element.prototype._node = function(selector) {
//     if (!selector) {
//         console.error('fn _node: Не вказано селектор');
//         return null;
//     }
//     return this.querySelectorAll(selector);
// };

NodeList.prototype._click = function (fn) {
    this.forEach(element => {
        element.addEventListener('click', fn);
    });
};

document.querySelectorAll('option');

$('.cs-option')._click(function () {
    console.log(this)
    console.log('hello')
})


