/**
 * Отправка формы. Валидация
 * Для полей, которые обязательны установить атрибут [data-rq]
 */
async function sendEmail(from) {
    event.preventDefault();

    let formData = new FormData(form);
    // formData.append('url', window.location.href) // добавить ключ: значение в formData
    setCookie('name', formData.get('name'), 30);
    setCookie('email', formData.get('email'), 30);
    setCookie('phone', formData.get('phone'), 30);

    let errors = validate(form);

    if (errors === 0) {
        form.classList.add('loading');
        let response = await fetch('https://myapi.com/mailer/export.php', {
            method: 'POST',
            body: formData,
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data)
            form.classList.remove('loading');
            form.classList.add('success');
            
            // setTimeout(function() {
            //     document.querySelector('#get-call .modal__close').click();
            // }, 2000)
            setTimeout(function () {
                form.classList.remove('success');
            }, 2600);
        })
        .catch(function (error) {
            console.log('error', error)
            form.classList.remove('loading');
        })
    } else {
        console.log(from.querySelectorAll('input._error')[0])
    }
}

// Валидатор форм 
function validate(form) {
    let errorClass = '_error';  // Класс ошибки для формы и интпута в котором ошибка
    let errorsCount = 0;        // Счетчик колличества ошибок в форме. Возвращаем
    let required = form.querySelectorAll('*[data-rq]'); // Поля формы, которые нужно проверять
    
    for (let i = 0; i < required.length; i++) {
        const input = required[i];
        removeInputError(input);
        if (input.type == 'text' && input.value.length < 2) {
            addInputError(input);
            errorsCount++;
        }
        else if (input.type == 'email') {
            if (testEmail(input)) {
                addInputError(input);
                errorsCount++;
            }
        } else if (input.type == 'tel' && input.value.length < 10) {
            addInputError(input);
            errorsCount++;
        }
    }

    // Добавляю классы ошибки
    function addInputError(input) {
        input.parentElement.classList.add(errorClass);
        input.classList.add(errorClass);
    }

    // Удаляю классы ошибки
    function removeInputError(input) {
        input.parentElement.classList.remove(errorClass);
        input.classList.remove(errorClass);
    }

    // Тест эл.почты
    function testEmail(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }
    return errorsCount;
}

// Запрещаю ввод не цифоровых значений в поле для телефона
for (let tel of document.querySelectorAll('input[type="tel"]')) {
    tel.addEventListener('keypress', e => {
        if(!/\d/.test(e.key))
          e.preventDefault();
    });
}