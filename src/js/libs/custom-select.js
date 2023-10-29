// Создаю событие для отслеживания при изменении поля програмно
let _customSelectInputEvent = new Event('input', {bubbles: true});

class CustomSelect {
    defaults = {
        listMaxHeight: 300,
    };

    constructor(selector, handle = {}) {
        // Перезаписываю дефолтные настройки (если их указал пользователь)
        Object.assign(this.defaults, handle);

        // Получаю коллекцию элементов select
        let entries = document.querySelectorAll(selector);

        // Проходимся циклом по каждому select
        entries.forEach(select => {
            // Создаю новую HTML структуру для каждого select (select -> cs)
            let cs = this.createHTML(select);

            // Создаю события для каждого custom select (cs)
            cs.addEventListener('click', (e) => {
                // Клик на cs-selected (открытие / закрытие)
                if (e.target.closest('.cs-selected')) {
                    this.closeAllCS(e.target.closest('.cs-select')); 
                    if (e.target.closest('.cs-select').classList.contains('_active')) {
                        this.closeCS(cs);
                    } else {
                        this.openCS(cs);
                    }
                }

                // Клик на cs-option
                if (e.target.closest('.cs-option')) {
                    select.querySelector(`option[value="${e.target.dataset.value}"]`).selected = true;
                    this.closeCS(cs)
                    select.dispatchEvent(_customSelectInputEvent) // срабатывает событие input на select
                };                
            })

            // Устанавливает в custom select выбраный элемент по умолчанию (до взаимодействия с пользователем) (select -> cs)
            cs.querySelector('.cs-selected').innerText = select.options[select.selectedIndex].innerText;
            cs.querySelector(`.cs-option[data-value="${select.options[select.selectedIndex].value}"]`).classList.add('_active')

            // Устанавливает в custom select выбраный элемент (после взаимодействия с пользователем) (select -> cs)
            select.addEventListener('input', (e) => {
                let selectedOption = select.options[select.selectedIndex];
                cs.querySelector(`.cs-option._active`)?.classList.remove('_active')
                cs.querySelector(`.cs-option[data-value="${selectedOption.value}"]`).classList.add('_active')
                cs.querySelector('.cs-selected').innerText = selectedOption.innerText;
            })
           
            // Убираем класс _closing у выпадающего списка после завершения анимации (для изменения z-index) (cs)
            cs.querySelector('.cs-options-wrap').addEventListener('transitionend', function (e) {
                if (this.classList.contains('_closing')) this.classList.remove('_closing')
            })

            // Прячем оригинальный select (select)
            select.style.display='none';

            // Вставляем custom select в html поле оригинального select (cs -> html )
            select.insertAdjacentElement('afterend', cs);
        });


        // Закрываем все custom select если клик за пределами custom select
        document.documentElement.addEventListener('click', (e) => {
            if (!e.target.closest('.cs-selected')) this.closeAllCS()   
        })
    }

    // Создает структуру HTML для нового селекта
    createHTML(select) {
        // Оболочка select
        let cs = document.createElement('div')
            cs.className = select.className;
            cs.classList.add('cs-select')

        // Элемент для отображения выбранного параметра
        let csSelected = document.createElement('div')
        csSelected.classList.add('cs-selected')

        // Оболочка для option
        let optionsWrap = document.createElement('div')
            optionsWrap.classList.add('cs-options-wrap')

        cs.insertAdjacentElement('beforeend', csSelected)

        // Создаю options
        select.querySelectorAll('option').forEach(option  => {
            let newOption = document.createElement('div');
                newOption.className = option.className;
                newOption.classList.add('cs-option');
                newOption.innerText = option.innerText
                newOption.setAttribute('data-value', option.value)
           
                optionsWrap.insertAdjacentElement('beforeend', newOption)
        });

        cs.insertAdjacentElement('beforeend', optionsWrap)

        return cs;
    }

    openCS(targetCS) {
        targetCS?.classList.add('_active');
        targetCS.querySelector('.cs-selected').classList.add('_active')
        let optionsWrap = targetCS.querySelector('.cs-options-wrap');
        optionsWrap?.classList.add('_active');
        optionsWrap.style.height = optionsWrap.scrollHeight < this.defaults.listMaxHeight ? optionsWrap.scrollHeight + 'px' : this.defaults.listMaxHeight + 'px';
    }

    closeCS(targetCS) {
        targetCS?.classList.remove('_active');
        targetCS.querySelector('.cs-selected').classList.remove('_active')
        let optionsWrap = targetCS.querySelector('.cs-options-wrap');
        optionsWrap.classList.add('_closing')
        optionsWrap.classList.remove('_active')
        optionsWrap.style.height = '0px';
    }

    closeAllCS(exclude) {
        let allCS = document.querySelectorAll('.cs-select');
        for (const cs of allCS) {
            if (exclude == cs || !cs.classList.contains('_active')) continue;
            this.closeCS(cs);
        }
    }
}