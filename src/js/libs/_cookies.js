/**
  * Отримує і повертає кукі 
  * @param cname - ім'я кукі
  * @returns Значення cookie із вказаним іменем
 */
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

/**
 * Встановити кукі
  * @param cname  - ім'я кукі
  * @param cvalue - значення
  * @param Exdays - термін дії
 */
function setCookie(cname, cvalue, exdays) {
    var date = new Date();
    date.setTime(date.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + date.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}

/**
 * Отримує та повертає значення url параметра
 * @param param - ім'я url параметра
 * @returns значення url параметра або пусту строку, якщо параметр не знайдено
 */
function getUrlParameter(param) {
    let url = decodeURIComponent( window.location.href.split('?')[1] );
    let urlVars = url.split('&'), key, value, i;  
    for (i = 0; i < urlVars.length; i++)     {
        key = urlVars[i].split('=')[0];
        value = urlVars[i].split('=')[1]
        return key === param && value ? value : false;
    }
};