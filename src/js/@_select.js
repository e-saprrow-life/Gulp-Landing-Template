/**
 * 
new CustomSelect({
    wrapper: '.cs',          // Класс родителя в котором нужно стилизовать селект
    previewClass: 'form__preview', // Задает имя класса для элемента отображающего выбранный элемент 
    listTag: 'ul',    // Тег оболочки списка опций
    optionTag: 'li',  // Тег опции
    multiOpen: false,  // Позволяет оставаться открытым списку при взаимодее с другим
    closeAfterClick: true, // Закрывает список после нажатия на опцию
    overClick: true, // Закрывает открытые списки если клик был не на элементе списка
});*/



export function CustomSelect(param) {
	let settings = {
		wrapper: '.cs',          // Класс родителя в котором нужно стилизовать селект
		previewClass: 'preview', // Задает имя класса для элемента отображающего выбранный элемент 
        listTag: 'ul',    // Тег оболочки списка опций
        optionTag: 'li',  // Тег опции
		multiOpen: false,  // Позволяет оставаться открытым списку при взаимодее с другим
        closeAfterClick: true, // Закрывает список после нажатия на опцию
		overClick: true, // Закрывает открытые списки если клик был не на элементе списка
        start: start
	};
	
    if (param) {
        Object.assign(settings, param);
    }
	
    let csDefault = {
        wrapper: 'custom-select',
        preview: 'custom-select__preview',
        list: 'custom-select__list',
        option: 'custom-select__option'
    }

	settings.start();
	


	function start() {
        let wrapper = document.querySelectorAll(settings.wrapper);
        if (!wrapper || wrapper.length == 0) return;

        for (let i = 0; i < wrapper.length; i++) {
            createCustomSelect(wrapper[i], i);
        }
	}




    function createCustomSelect(cs, i) {
        let csWrapper = createWrapper();
        let csList = createList(cs)

        cs.querySelector('select').style.display = 'none';

        cs.insertAdjacentElement('beforeend', csWrapper);
        csWrapper.insertAdjacentElement('beforeend', csList);

        // Задаю изначальное значение для превью
        cs.querySelector('.' + csDefault.preview).textContent = 
        cs.querySelectorAll('option')[0].textContent;

        
        cs.querySelector('.' + csDefault.preview).addEventListener('click', function () {
            if (!settings.multiOpen) {
                closeAllLists(i);
            }
            
            toggleList(cs.querySelector('.' + csDefault.list));
        });


        let options = cs.querySelectorAll('option');
        let csOptions = cs.querySelectorAll('.' + csDefault.option);

        for (let i = 0; i < csOptions.length; i++) {
            csOptions[i].addEventListener('click', function () {
                removeSelectAttributes(options);
                removeSelectClass(csOptions);
                options[i].setAttribute('selected', '');
                csOptions[i].classList.add('_selected');
                cs.querySelector('.' + csDefault.preview).textContent = csOptions[i].textContent;
                if (settings.closeAfterClick) {
                    closeList(cs.querySelector('.' + csDefault.list))
                }
            });
        };

    }


// Создаю структуру
    // Создаю оболочку для нового селекта
    function createWrapper() {
        let csWrapper = document.createElement('div'); // create wrapper element
            csWrapper.classList.add(csDefault.wrapper); 

        let csPreview = document.createElement('div'); // create preview element
            csPreview.classList.add(csDefault.preview);
            csPreview.classList.add(settings.previewClass);

            csWrapper.insertAdjacentElement('beforeend', csPreview);
        return csWrapper;
    }


    // Создаю список с опциями
    function createList(elem) {
        let csList = document.createElement(settings.listTag);  
            csList.classList.add(csDefault.list); 
            csList.classList.add(elem.querySelector('select').className);
            csList.style.maxHeight = 0 + 'px';

        let options = elem.querySelectorAll('option');
        for (let i = 0; i < options.length; i++) {
            let csOption = document.createElement(settings.optionTag);
                csOption.classList.add(csDefault.option);
                csOption.classList.add(options[i].className);
                csOption.textContent = options[i].textContent;

                csList.insertAdjacentElement('beforeend', csOption);
        };
        return csList;
    }
// END Создаю структуру



// События для превью
    function toggleList(elem) {
        if (!elem.classList.contains('_open')) {
            openList(elem);
        } else {
            closeList(elem);
        }
    }


    function openList(elem) {
        elem.closest('.' + csDefault.wrapper).classList.add('_open');
        elem.classList.add('_open');
        elem.style.maxHeight = elem.scrollHeight + "px";

        if (settings.overClick) {
            document.addEventListener('click', overClick);
        }
    }
// END События для превью


    function closeList(elem) {
        elem.closest('.' + csDefault.wrapper).classList.remove('_open');
        elem.classList.remove('_open');
        elem.style.maxHeight = 0 + "px";

        if (settings.overClick) {
            document.removeEventListener('click', overClick);
        }
    }




    function removeSelectAttributes(elems) {
        for (let i = 0; i < elems.length; i++) {
            elems[i].removeAttribute('selected');
        };
    }

    function removeSelectClass(elems) {
        for (let i = 0; i < elems.length; i++) {
            elems[i].classList.remove('_selected');
        };
    }



    function closeAllLists(index) {
        let lists = document.querySelectorAll(settings.wrapper);
        for (let i = 0; i < lists.length; i++) {
            if (i != index) {
                closeList(lists[i].querySelector('.' + csDefault.list));
            }
        };
    }


    function overClick(e) {
        if (!e.target.closest('.' + csDefault.wrapper)) {
            closeAllLists()
        }
    }
};



