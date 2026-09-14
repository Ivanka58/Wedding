// Инициализация EmailJS
emailjs.init(window.EMAILJS_PUBLIC_KEY);

// ЭКРАН 1: Побегающая кнопка "Нет"
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
let noClicks = 0;

const noTexts = [
    "Нет",
    "Точно нет?",
    "Подумай ещё!",
    "А если подумать?",
    "Последний шанс!",
    "Ну пожалуйста!",
    "Я расстроюсь...",
    "Кнопка да красивее!"
];

btnNo.addEventListener('click', () => {
    noClicks++;
    
    // Увеличиваем кнопку "Да"
    const scale = 1 + noClicks * 0.4;
    btnYes.style.transform = `scale(${Math.min(scale, 5)})`;
    btnYes.style.position = 'relative';
    btnYes.style.zIndex = '10';
    
    // Меняем текст кнопки "Нет"
    if (noClicks < noTexts.length) {
        btnNo.textContent = noTexts[noClicks];
    }
    
    // Прячем кнопку "Нет" после 6 кликов
    if (noClicks >= 6) {
        btnNo.style.display = 'none';
        btnYes.style.transform = 'scale(1.5)';
        btnYes.textContent = "Ну конечно да! ❤️";
    }
    
    // Убегающий эффект
    if (noClicks > 2 && noClicks < 6) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 100;
        btnNo.style.transform = `translate(${x}px, ${y}px)`;
    }
});

btnYes.addEventListener('click', () => {
    document.getElementById('screen-invite').classList.remove('active');
    document.getElementById('screen-main').classList.add('active');
});

// ОПРОС
document.getElementById('btn-attend-yes').addEventListener('click', () => sendResponse(true));
document.getElementById('btn-attend-no').addEventListener('click', () => sendResponse(false));

function sendResponse(willAttend) {
    const name = document.getElementById('guest-name').value.trim();
    if (!name) {
        alert('Пожалуйста, введите ваше имя!');
        return;
    }
    
    const alcohol = Array.from(document.querySelectorAll('input[name="alcohol"]:checked'))
        .map(cb => cb.value);
    
    const templateParams = {
        guest_name: name,
        attendance: willAttend ? "✅ Согласен прийти!" : "❌ К сожалению, не сможет прийти",
        alcohol: alcohol.length > 0 ? alcohol.join(", ") : "Ничего не выбрал",
        date: new Date().toLocaleString('ru-RU')
    };
    
    emailjs.send(window.EMAILJS_SERVICE_ID, window.EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
            showModal();
        })
        .catch((error) => {
            alert('Ошибка отправки. Попробуйте позже.');
            console.error('EmailJS error:', error);
        });
}

function showModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.add('active');
    setTimeout(() => {
        modal.classList.remove('active');
    }, 3000);
}
