    // Доробити попап для відео
    document.querySelectorAll('a[href*="#modal-"]').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href'))?.classList.add('_visible')
            document.body.classList.add('_lock')
        })
    });

    // Закриття попапу при натисканні Esc
    document.addEventListener('keydown', function (event) {
        if(event.code == 'Escape') closeModal()
    });

    function closeModal() {
        document.querySelector('.modal._visible')?.classList.remove('_visible')
        document.body.classList.remove('_lock')
    }

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target.closest('.modal__close') || !e.target.closest('.modal__body'))  closeModal()
        })
    })

    // let modals = document.querySelectorAll('.modal');
    // let openClass = '_open'

    // document.body.addEventListener('click', function () {
    //     // Открыть попап
    //     if (event.target.closest('[data-modal-id]')) {
    //         if (!document.querySelector('.modal#' + event.target.dataset.modalId)) return;
    //         document.querySelector('.modal#' + event.target.dataset.modalId).classList.add(openClass)
    //         document.body.classList.add('_lock')
    //         if (event.target.closest('[data-yt-id]')) {
    //             let target = document.querySelector('.modal#' + event.target.dataset.modalId + " .modal__content")
    //             target.innerHTML = '<div class="modal__close"></div>'
    //             target.insertAdjacentHTML('beforeend', `
    //                 <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${event.target.dataset.ytId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    //             `)
    //         }
    //     }

    //     // Закрыть попап если клик в неактивном месте попапа или на крестике
    //     if (event.target.closest('.modal__close') || event.target.closest('.modal') && !event.target.closest('.modal__content')) {
    //         event.target.closest('.modal').classList.remove(openClass);
    //         document.body.classList.remove('_lock')
    //         event.target.closest('.modal').querySelector('iframe')?.remove();
    //     }
    // })

    // // Закрытие попапа при клике на Esc
    // document.addEventListener('keydown', function () {
    //     if(event.code == 'Escape'){
    //         if (document.querySelectorAll('.modal._open')) {
    //             document.body.classList.remove('_lock')
    //         }
    //         for (const modal of modals) {
    //             modal.classList.remove(openClass)
    //         }
    //     };
    // });

    // function openModal(id) {
    //     document.querySelector('.modal#' + id).classList.add('_open')
    //     document.body.classList.add('_lock')
    // };