// Скрипти та дії, які виконуються за замовчуванням. 
document.addEventListener('DOMContentLoaded', function () {

    // Для scroll-behavior встановлюю відступ від верхньої частини в'юпорта розміром header
    document.documentElement.style.scrollPaddingTop = document.querySelector('header')?.offsetHeight ? document.querySelector('header')?.offsetHeight + 'px': '0px'

    // Встановлю в поля форм дані із кукі
    document.querySelector('input[name=name]')?.setAttribute('value', getCookie("name"));
    document.querySelector('input[name=email]')?.setAttribute('value', getCookie("email"));
    document.querySelector('input[name=phone]')?.setAttribute('value', getCookie("phone"));

    // Встановлю UTM мітки в hidden поля
    document.querySelector('input[name=utm_source]')?.setAttribute('value', getUrlParameter("utm_source"));
    document.querySelector('input[name=utm_medium]')?.setAttribute('value', getUrlParameter("utm_medium"));
    document.querySelector('input[name=utm_term]')?.setAttribute('value', getUrlParameter("utm_term"));
    document.querySelector('input[name=utm_campaign]')?.setAttribute('value', getUrlParameter("utm_campaign"));
    document.querySelector('input[name=utm_content]')?.setAttribute('value', getUrlParameter("utm_content"));


    // Inputmask
    // input(name="phone2" type="tel" data-rq data-inputmask="'mask': '099-99-99-999', 'placeholder': '0  -  -  -   '")
    //Inputmask().mask(document.querySelectorAll('input[data-inputmask]'))
})