document.addEventListener('DOMContentLoaded', function () {
    // Форматирование телефона (ИСПРАВЛЕННЫЙ КОД)
    const phone = document.getElementById('phone');
    if (phone) {
        phone.addEventListener('input', () => {
            const digits = phone.value.replace(/\D/g, '').slice(0, 11); // до 11 цифр
            const d = digits.replace(/^8/, '7');

            const parts = [];
            if (d.length > 0) parts.push('+7');
            if (d.length > 1) parts.push(' (' + d.slice(1, 4));
            if (d.length >= 4) parts[parts.length - 1] += ')';
            if (d.length >= 5) parts.push(' ' + d.slice(4, 7));
            if (d.length >= 8) parts.push('-' + d.slice(7, 9));
            if (d.length >= 10) parts.push('-' + d.slice(9, 11));

            phone.value = parts.join('');
            phone.setAttribute('pattern', '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$');
        });
    }

    // Получаем элементы
    const dlg = document.getElementById('contactDialog');
    const openBtn = document.getElementById('openDialog');
    const closeBtn = document.getElementById('closeDialog');
    const form = document.getElementById('contactForm');
    let lastActive = null;
    // Закрытие на Esc и управление фокусом
    // Улучшенное управление фокусом
    dlg.addEventListener('keydown', (e) => {
        // Закрытие на Escape
        if (e.key === 'Escape') {
            e.preventDefault();
            dlg.close('cancel');
            return;
        }

        // Удержание фокуса внутри модального окна
        if (e.key === 'Tab') {
            const focusableSelectors = 'button, input, select, textarea, [href], [tabindex]:not([tabindex="-1"])';
            const focusableElements = Array.from(dlg.querySelectorAll(focusableSelectors));

            // Фильтруем только видимые и не disabled элементы
            const visibleFocusableElements = focusableElements.filter(el =>
                el.offsetParent !== null && !el.disabled
            );

            const firstElement = visibleFocusableElements[0];
            const lastElement = visibleFocusableElements[visibleFocusableElements.length - 1];

            if (e.shiftKey) { // Shift+Tab - назад
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { // Tab - вперед
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });

    // Проверяем, существуют ли элементы на странице
    if (!dlg || !openBtn || !closeBtn || !form) {
        console.error('Не найдены необходимые элементы для модального окна');
        return;
    }

    // Открытие модального окна
    openBtn.addEventListener('click', () => {
        lastActive = document.activeElement;
        dlg.showModal();
        dlg.querySelector('input, select, textarea, button')?.focus();
    });

    // Закрытие модального окна
    closeBtn.addEventListener('click', () => dlg.close('cancel'));

    // Обработка отправки формы
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (form.checkValidity()) {
            alert('Форма отправлена! Мы свяжемся с вами в ближайшее время.');
            dlg.close();
            form.reset();
        } else {
            form.reportValidity();
        }
    });

    // Возврат фокуса после закрытия
    dlg.addEventListener('close', () => {
        lastActive?.focus();
    });

    // Закрытие модального окна при клике вне его области
    dlg.addEventListener('click', (e) => {
        const dialogDimensions = dlg.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            dlg.close();
        }
    });
});