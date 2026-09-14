/* =========================================================
   ALICE & KIRILL — WEDDING INVITATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       EMAILJS
       ===================================================== */

    if (
        window.emailjs &&
        window.EMAILJS_PUBLIC_KEY
    ) {
        emailjs.init({
            publicKey: window.EMAILJS_PUBLIC_KEY
        });
    }


    /* =====================================================
       ЭКРАН ПРИГЛАШЕНИЯ
       ===================================================== */

    const inviteScreen = document.getElementById("screen-invite");
    const mainScreen = document.getElementById("screen-main");

    const btnYes = document.getElementById("btn-yes");
    const btnNo = document.getElementById("btn-no");

    let noClicks = 0;

    const noTexts = [
        "Нет",
        "Точно нет?",
        "Подумай ещё",
        "А если подумать?",
        "Последний шанс",
        "Ну пожалуйста",
        "Я расстроюсь…",
        "Кнопка «Да» красивее!"
    ];


    /* =====================================================
       КНОПКА "НЕТ"
       ===================================================== */

    if (btnNo && btnYes) {

        btnNo.addEventListener("click", () => {

            noClicks++;

            /*
             * С каждым нажатием кнопка "Да"
             * становится немного больше.
             */

            const scale = Math.min(
                1 + noClicks * 0.18,
                2.1
            );

            btnYes.style.transform = `scale(${scale})`;


            /*
             * Меняем текст кнопки "Нет"
             */

            if (noClicks < noTexts.length) {
                btnNo.textContent = noTexts[noClicks];
            }


            /*
             * После нескольких попыток
             * кнопка "Нет" исчезает.
             */

            if (noClicks >= 6) {

                btnNo.style.display = "none";

                btnYes.textContent = "Ну конечно да! ♥";

                btnYes.style.transform = "scale(1.18)";

                return;
            }


            /*
             * После третьего клика
             * кнопка начинает убегать.
             */

            if (noClicks >= 3) {

                const x =
                    (Math.random() - 0.5) * 160;

                const y =
                    (Math.random() - 0.5) * 80;

                btnNo.style.transform =
                    `translate(${x}px, ${y}px)`;
            }

        });

    }


    /* =====================================================
       КНОПКА "ДА"
       ===================================================== */

    if (btnYes) {

        btnYes.addEventListener("click", () => {

            /*
             * Убираем экран приглашения
             */

            if (inviteScreen) {
                inviteScreen.classList.remove("active");
            }


            /*
             * Показываем основной сайт
             */

            if (mainScreen) {
                mainScreen.classList.add("visible");
            }


            /*
             * Возвращаем страницу наверх
             */

            window.scrollTo({
                top: 0,
                behavior: "instant"
            });


            document.body.classList.add("site-open");


            /*
             * Запускаем первые анимации
             */

            setTimeout(() => {

                document
                    .querySelectorAll(".main-screen .reveal")
                    .forEach(element => {

                        const rect =
                            element.getBoundingClientRect();

                        if (
                            rect.top <
                            window.innerHeight * 0.92
                        ) {
                            element.classList.add("is-visible");
                        }

                    });

            }, 100);

        });

    }


    /* =====================================================
       АНИМАЦИИ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ
       ===================================================== */

    const revealItems =
        document.querySelectorAll(".reveal");


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(

                (entries) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "is-visible"
                            );

                            /*
                             * Больше этот элемент
                             * наблюдать не нужно.
                             */

                            observer.unobserve(
                                entry.target
                            );
                        }

                    });

                },

                {
                    threshold: 0.12,

                    rootMargin:
                        "0px 0px -40px 0px"
                }

            );


        revealItems.forEach(item => {
            observer.observe(item);
        });

    } else {

        /*
         * Запасной вариант для старых браузеров
         */

        revealItems.forEach(item => {
            item.classList.add("is-visible");
        });

    }


    /* =====================================================
       RSVP
       ===================================================== */

    const attendYes =
        document.getElementById("btn-attend-yes");

    const attendNo =
        document.getElementById("btn-attend-no");

    const guestName =
        document.getElementById("guest-name");


    if (attendYes) {

        attendYes.addEventListener(
            "click",
            () => sendResponse(true)
        );

    }


    if (attendNo) {

        attendNo.addEventListener(
            "click",
            () => sendResponse(false)
        );

    }


    /* =====================================================
       ОТПРАВКА ОТВЕТА
       ===================================================== */

    async function sendResponse(willAttend) {

        /*
         * Получаем имя
         */

        const name =
            guestName
                ? guestName.value.trim()
                : "";


        /*
         * Проверяем имя
         */

        if (!name) {

            if (guestName) {

                guestName.focus();

                guestName.classList.add(
                    "input-error"
                );


                setTimeout(() => {

                    guestName.classList.remove(
                        "input-error"
                    );

                }, 900);

            }

            return;
        }


        /* =================================================
           ПОЛУЧАЕМ ВЫБРАННЫЕ НАПИТКИ
           ================================================= */

        const alcohol =
            Array.from(

                document.querySelectorAll(
                    'input[name="alcohol"]:checked'
                )

            ).map(
                checkbox => checkbox.value
            );


        /*
         * Если человек выбрал несколько,
         * они отправятся одной строкой.
         *
         * Например:
         *
         * Вино белое, Безалкогольные напитки
         */

        const alcoholText =
            alcohol.length > 0
                ? alcohol.join(", ")
                : "Ничего не выбрал";


        /* =================================================
           ДАННЫЕ ДЛЯ EMAILJS
           ================================================= */

        const templateParams = {

            guest_name: name,

            attendance: willAttend
                ? "✅ Согласен прийти!"
                : "❌ К сожалению, не сможет прийти",

            alcohol: alcoholText,

            date:
                new Date().toLocaleString(
                    "ru-RU"
                )

        };


        /* =================================================
           ПРОВЕРКА EMAILJS
           ================================================= */

        if (
            !window.emailjs ||
            !window.EMAILJS_SERVICE_ID ||
            !window.EMAILJS_TEMPLATE_ID ||
            !window.EMAILJS_PUBLIC_KEY
        ) {

            /*
             * Если EmailJS ещё не настроен,
             * сайт не ломается.
             */

            console.warn(
                "EmailJS не настроен.",
                templateParams
            );


            showModal();

            return;
        }


        /* =================================================
           ОТПРАВКА EMAIL
           ================================================= */

        try {

            await emailjs.send(

                window.EMAILJS_SERVICE_ID,

                window.EMAILJS_TEMPLATE_ID,

                templateParams

            );


            /*
             * Успешная отправка
             */

            showModal();


        } catch (error) {

            console.error(
                "EmailJS error:",
                error
            );


            alert(
                "Не удалось отправить ответ. " +
                "Попробуйте ещё раз."
            );

        }

    }


    /* =====================================================
       МОДАЛЬНОЕ ОКНО
       ===================================================== */

    const modal =
        document.getElementById(
            "success-modal"
        );


    const modalClose =
        document.querySelector(
            ".modal-close"
        );


    function showModal() {

        if (!modal) return;


        modal.classList.add(
            "active"
       