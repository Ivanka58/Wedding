/* =========================================================
   НАСТРОЙКИ EMAILJS
=========================================================

   Если хочешь отправлять ответы на почту через EmailJS,
   впиши сюда свои данные.

   Если пока оставить пустыми — сайт ВСЁ РАВНО будет работать.
   Просто после отправки будет показываться сообщение.

========================================================= */

const EMAILJS_PUBLIC_KEY = "";
const EMAILJS_SERVICE_ID = "";
const EMAILJS_TEMPLATE_ID = "";


/* =========================================================
   ИНИЦИАЛИЗАЦИЯ EMAILJS
========================================================= */

let emailJsReady = false;

if (
    typeof emailjs !== "undefined" &&
    EMAILJS_PUBLIC_KEY !== ""
) {
    try {
        emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY
        });

        emailJsReady = true;
    } catch (error) {
        console.error("EmailJS initialization error:", error);
    }
}


/* =========================================================
   ПОЛУЧАЕМ ЭЛЕМЕНТЫ
========================================================= */

const inviteScreen = document.getElementById("screen-invite");
const mainScreen = document.getElementById("screen-main");

const btnYes = document.getElementById("btn-yes");
const btnNo = document.getElementById("btn-no");

const btnAttendYes = document.getElementById("btn-attend-yes");
const btnAttendNo = document.getElementById("btn-attend-no");

const guestName = document.getElementById("guest-name");

const successModal = document.getElementById("success-modal");
const modalClose = document.getElementById("modal-close");


/* =========================================================
   ПРОВЕРКА ЭЛЕМЕНТОВ
========================================================= */

if (!inviteScreen || !mainScreen || !btnYes || !btnNo) {

    console.error(
        "Ошибка: не найдены элементы первого экрана."
    );
}


/* =========================================================
   КНОПКА "ДА"
========================================================= */

if (btnYes) {

    btnYes.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        inviteScreen.classList.remove("active");

        mainScreen.classList.add("active");

        // Переходим к началу основного сайта
        window.scrollTo({
            top: 0,
            behavior: "instant"
        });

        // Запускаем появление блоков
        startRevealAnimations();

    });

}


/* =========================================================
   КНОПКА "НЕТ"
========================================================= */

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


if (btnNo) {

    btnNo.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        noClicks++;

        /* ---------------------------------------------
           Увеличиваем кнопку "Да"
        --------------------------------------------- */

        const scale = Math.min(
            1 + noClicks * 0.15,
            1.8
        );

        btnYes.style.transform =
            `scale(${scale})`;


        /* ---------------------------------------------
           Меняем текст "Нет"
        --------------------------------------------- */

        if (noClicks < noTexts.length) {

            btnNo.textContent =
                noTexts[noClicks];

        }


        /* ---------------------------------------------
           После нескольких нажатий
        --------------------------------------------- */

        if (noClicks >= 6) {

            btnNo.style.display = "none";

            btnYes.style.transform =
                "scale(1.25)";

            btnYes.innerHTML =
                "Ну конечно да! ❤️";

            return;
        }


        /* ---------------------------------------------
           Убегание кнопки
           Только после нескольких нажатий
        --------------------------------------------- */

        if (
            noClicks >= 3 &&
            window.innerWidth > 480
        ) {

            const x =
                (Math.random() - 0.5) * 160;

            const y =
                (Math.random() - 0.5) * 80;

            btnNo.style.transform =
                `translate(${x}px, ${y}px)`;
        }

    });

}


/* =========================================================
   RSVP — "Я ПРИДУ"
========================================================= */

if (btnAttendYes) {

    btnAttendYes.addEventListener(
        "click",
        function () {

            sendResponse(true);

        }
    );

}


/* =========================================================
   RSVP — "НЕ СМОГУ"
========================================================= */

if (btnAttendNo) {

    btnAttendNo.addEventListener(
        "click",
        function () {

            sendResponse(false);

        }
    );

}


/* =========================================================
   ОТПРАВКА ОТВЕТА
========================================================= */

async function sendResponse(willAttend) {

    /* ---------------------------------------------
       Получаем имя
    --------------------------------------------- */

    const name =
        guestName
            ? guestName.value.trim()
            : "";


    /* ---------------------------------------------
       Проверяем имя
    --------------------------------------------- */

    if (!name) {

        showMessage(
            "Пожалуйста, введите ваше имя и фамилию."
        );

        if (guestName) {
            guestName.focus();
        }

        return;
    }


    /* ---------------------------------------------
       Получаем напитки
    --------------------------------------------- */

    const selectedAlcohol =
        Array.from(
            document.querySelectorAll(
                'input[name="alcohol"]:checked'
            )
        ).map(function (checkbox) {

            return checkbox.value;

        });


    /* ---------------------------------------------
       Если ничего не выбрали
    --------------------------------------------- */

    const alcohol =
        selectedAlcohol.length > 0
            ? selectedAlcohol.join(", ")
            : "Не указано";


    /* ---------------------------------------------
       Текст ответа
    --------------------------------------------- */

    const attendance =
        willAttend
            ? "Я приду"
            : "Не смогу прийти";


    /* ---------------------------------------------
       Данные для EmailJS
    --------------------------------------------- */

    const templateParams = {

        guest_name: name,

        attendance: attendance,

        alcohol: alcohol,

        date: new Date().toLocaleString(
            "ru-RU"
        )

    };


    /* ---------------------------------------------
       Если EmailJS настроен
    --------------------------------------------- */

    if (
        emailJsReady &&
        EMAILJS_SERVICE_ID !== "" &&
        EMAILJS_TEMPLATE_ID !== ""
    ) {

        try {

            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams
            );

            showSuccessModal();

        } catch (error) {

            console.error(
                "EmailJS error:",
                error
            );

            showMessage(
                "Не удалось отправить ответ. Попробуйте ещё раз."
            );

        }

        return;
    }


    /* ---------------------------------------------
       Если EmailJS пока не настроен
       Сайт всё равно работает
    --------------------------------------------- */

    console.log(
        "Ответ гостя:",
        templateParams
    );

    showSuccessModal();

}


/* =========================================================
   ПОКАЗЫВАЕМ УСПЕШНОЕ СООБЩЕНИЕ
========================================================= */

function showSuccessModal() {

    if (!successModal) {
        return;
    }

    successModal.classList.add("active");

    successModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* =========================================================
   ЗАКРЫВАЕМ МОДАЛКУ
========================================================= */

function closeModal() {

    if (!successModal) {
        return;
    }

    successModal.classList.remove("active");

    successModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeModal
    );

}


/* =========================================================
   КЛИК ПО ФОНУ МОДАЛКИ
========================================================= */

if (successModal) {

    successModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === successModal
            ) {

                closeModal();

            }

        }
    );

}


/* =========================================================
   ESC — ЗАКРЫТЬ МОДАЛКУ
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            successModal &&
            successModal.classList.contains("active")
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   ПРОСТОЕ СООБЩЕНИЕ ОБ ОШИБКЕ
========================================================= */

function showMessage(message) {

    alert(message);

}


/* =========================================================
   АНИМАЦИЯ БЛОКОВ
========================================================= */

function startRevealAnimations() {

    const elements =
        document.querySelectorAll(".reveal");


    if (!elements.length) {
        return;
    }


    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(
            function (element) {

                element.classList.add(
                    "visible"
                );

            }
        );

        return;
    }


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(
        function (element) {

            observer.observe(element);

        }
    );

}


/* =========================================================
   ЗАПУСК
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Первый экран показываем сразу
        inviteScreen.classList.add("active");

        // Анимации основного экрана
        startRevealAnimations();

    }
);