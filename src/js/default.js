document.addEventListener('DOMContentLoaded', function () {

    // Устанавливаю отступ от верхнего края вьюпорта для плавного скролла
    document.documentElement.style.scrollPaddingTop = document.querySelector('header')?.offsetHeight ? document.querySelector('header')?.offsetHeight + 'px': '0px'

})