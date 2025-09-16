document.addEventListener('DOMContentLoaded', function () {
    console.log('Скрипт загружен');

    // Элементы формы с БЭМ классами
    const phone = document.querySelector('.form__input[type="tel"]');
    const dlg = document.querySelector('.modal');
    const openBtn = document.querySelector('#openDialog');
    const closeBtn = document.querySelector('.btn--secondary');
    const form = document.querySelector('.form');
    
    // Проверяем, существуют ли элементы
    if (!dlg || !openBtn || !closeBtn || !form) {
        console.error('Не найдены необходимые элементы');
        return;
    }

    let lastActive = null;

    // Форматирование телефона
    if (phone) {
        phone.addEventListener('input', formatPhone);
    }

    // Функция форматирования телефона
    function formatPhone() {
        const digits = this.value.replace(/\D/g, '').slice(0, 11);
        const d = digits.replace(/^8/, '7');

        let formattedValue = '+7';
        if (d.length > 1) {
            formattedValue += ' (' + d.slice(1, 4);
            if (d.length >= 4) formattedValue += ')';
            if (d.length >= 5) formattedValue += ' ' + d.slice(4, 7);
            if (d.length >= 8) formattedValue += '-' + d.slice(7, 9);
            if (d.length >= 10) formattedValue += '-' + d.slice(9, 11);
        }

        this.value = formattedValue;
    }

    // Открытие модального окна
    function openModal() {
        lastActive = document.activeElement;
        dlg.showModal();
        
        // Фокус на первом поле формы
        const firstInput = dlg.querySelector('.form__input');
        if (firstInput) firstInput.focus();
    }

    // Закрытие модального окна
    function closeModal() {
        dlg.close('cancel');
    }

    // Обработка отправки формы
    function handleSubmit(e) {
        e.preventDefault();
        
        if (validateForm()) {
            alert('Форма отправлена! Мы свяжемся с вами в ближайшее время.');
            dlg.close();
            form.reset();
            removeErrorStyles();
        } else {
            showValidationErrors();
        }
    }

    // Валидация формы
    function validateForm() {
        const inputs = form.querySelectorAll('.form__input, .form__select, .form__textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.classList.add('form__input--error');
                isValid = false;
            }
        });

        return isValid;
    }

    // Удаление стилей ошибок
    function removeErrorStyles() {
        const inputs = form.querySelectorAll('.form__input, .form__select, .form__textarea');
        inputs.forEach(input => {
            input.classList.remove('form__input--error');
        });
    }

    // Показать ошибки валидации
    function showValidationErrors() {
        const invalidFields = form.querySelectorAll(':invalid');
        if (invalidFields.length > 0) {
            invalidFields[0].focus();
        }
        form.reportValidity();
    }

    // Управление фокусом в модальном окне
    function handleKeydown(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeModal();
            return;
        }

        if (e.key === 'Tab') {
            const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
            const focusableElements = Array.from(dlg.querySelectorAll(focusableSelectors));

            const visibleFocusableElements = focusableElements.filter(el =>
                el.offsetParent !== null && !el.disabled
            );

            if (visibleFocusableElements.length === 0) return;

            const firstElement = visibleFocusableElements[0];
            const lastElement = visibleFocusableElements[visibleFocusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    }

    // Обработчики событий
    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    form.addEventListener('submit', handleSubmit);
    dlg.addEventListener('keydown', handleKeydown);

    // Возврат фокуса после закрытия
    dlg.addEventListener('close', () => {
        lastActive?.focus();
    });

    // Закрытие при клике вне области
    dlg.addEventListener('click', (e) => {
        const dialogDimensions = dlg.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            closeModal();
        }
    });

    // Инициализация модального окна
    initModal();
});

// Инициализация модального окна
function initModal() {
    const modal = document.querySelector('.modal');
    if (!modal) return;

    console.log('Модальное окно инициализировано');
}