document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       EMAILJS
       ===================================================== */

    if (window.emailjs && window.EMAILJS_PUBLIC_KEY) {
        emailjs.init({
            publicKey: window.EMAILJS_PUBLIC_KEY
        });
    }


    /* =====================================================
       ЭКРАНЫ
       ===================================================== */

    const inviteScreen = document.getElementById("screen-invite");
    const mainScreen = document.getElementById("screen-main");

    const btnYes = document.getElementById("btn-yes");
    const btnNo = document.getElementById("btn-no");


    /* =====================================================
       ПРОВЕРКА ЭЛЕМЕНТОВ
       ===================================================== */

    console.log("Сайт загружен");

    console.log("Кнопка Да:", btnYes);
    console.log("Кнопка Нет:", btnNo);
    console.log("Экран приглашения:", inviteScreen);
    console.log("Главный экран:", mainScreen);


    /* =====================================================
       КНОПКА "ДА"
       ===================================================== */

    if (btnYes) {

        btnYes.addEventListener("click", function () {

            console.log("Нажата кнопка ДА");

            /*
             * Убираем первый экран
             */
            if (inviteScreen) {
                inviteScreen.classList.remove("active");
            }

            /*
             * Показываем основной экран
             */
            if (mainScreen) {
                mainScreen.classList.add("active");
            }

            /*
             * Возвращаем страницу наверх
             */
            window.scrollTo({
                top: 0,
                behavior: "instant"
            });

            document.body.classList.add("site-open");

        });

    }


    /* =====================================================
       КНОПКА "НЕТ"
       ===================================================== */

    let noClicks = 0;

    const noTexts = [
        "Нет",
        "Точно нет?",
        "Подумай ещё!",
        "А если подумать?",
        "Последний шанс!",
        "Ну пожалуйста!",
        "Я расстроюсь...",
        "Кнопка «Да» красивее!"
    ];


    if (btnNo && btnYes) {

        btnNo.addEventListener("click", function (event) {

            /*
             * Чтобы клик точно не всплывал
             */
            event.preventDefault();
            event.stopPropagation();

            noClicks++;

            console.log("Нажата кнопка НЕТ:", noClicks);


            /* ---------------------------------------------
               Увеличиваем кнопку ДА
               --------------------------------------------- */

            const scale = Math.min(
                1 + noClicks * 0.15,
                1.8
            );

            btnYes.style.transform =
                "scale(" + scale + ")";


            /* ---------------------------------------------
               Меняем текст кнопки НЕТ
               --------------------------------------------- */

            if (noClicks < noTexts.length) {

                btnNo.textContent =
                    noTexts[noClicks];

            }


            /* ---------------------------------------------
               После 6 попыток убираем НЕТ
               --------------------------------------------- */

            if (noClicks >= 6) {

                btnNo.style.display = "none";

                btnYes.textContent =
                    "Ну конечно да! ♥";

                btnYes.style.transform =
                    "scale(1.2)";

                return;
            }


            /* ---------------------------------------------
               Кнопка начинает убегать
               --------------------------------------------- */

            if (noClicks >= 3) {

                const x =
                    (Math.random() - 0.5) * 180;

                const y =
                    (Math.random() - 0.5) * 100;

                btnNo.style.transform =
                    "translate(" + x + "px, " + y + "px)";
            }

        });

    }


    /* =====================================================
       ОПРОС — КНОПКИ
       ===================================================== */

    const attendYes =
        document.getElementById("btn-attend-yes");

    const attendNo =
        document.getElementById("btn-attend-no");


    if (attendYes) {

        attendYes.addEventListener(
            "click",
            function () {
                sendResponse(true);
            }
        );

    }


    if (attendNo) {

        attendNo.addEventListener(
            "click",
            function () {
                sendResponse(false);
            }
        );

    }


    /* =====================================================
       ОТПРАВКА ОТВЕТА
       ===================================================== */

    function sendResponse(willAttend) {

        const nameInput =
            document.getElementById("guest-name");

        const name =
            nameInput
                ? nameInput.value.trim()
                : "";


        /* ---------------------------------------------
           Проверяем имя
           --------------------------------------------- */

        if (!name) {

            alert(
                "Пожалуйста, введите ваше имя и фамилию."
            );

            if (nameInput) {
                nameInput.focus();
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


        const alcohol =
            selectedAlcohol.length > 0
                ? selectedAlcohol.join(", ")
                : "Ничего не выбрано";


        /* ---------------------------------------------
           Формируем данные
           --------------------------------------------- */

        const templateParams = {

            guest_name: name,

            attendance: willAttend
                ? "✅ Я приду!"
                : "❌ К сожалению, не смогу прийти",

            alcohol: alcohol,

            date: new Date().toLocaleString("ru-RU")

        };


        console.log(
            "Данные для отправки:",
            templateParams
        );


        /* ---------------------------------------------
           Если EmailJS не настроен
           --------------------------------------------- */

        if (
            !window.emailjs ||
            !window.EMAILJS_SERVICE_ID ||
            !window.EMAILJS_TEMPLATE_ID ||
            !window.EMAILJS_PUBLIC_KEY
        ) {

            console.warn(
                "EmailJS не настроен. Данные:",
                templateParams
            );

            showModal();

            return;
        }


        /* ---------------------------------------------
           Отправляем
           --------------------------------------------- */

        emailjs.send(
            window.EMAILJS_SERVICE_ID,
            window.EMAILJS_TEMPLATE_ID,
            templateParams
        )
        .then(function (response) {

            console.log(
                "Ответ успешно отправлен:",
                response
            );

            showModal();

        })
        .catch(function (error) {

            console.error(
                "Ошибка EmailJS:",
                error
            );

            alert(
                "Не удалось отправить ответ. " +
                "Попробуйте ещё раз."
            );

        });

    }


    /* =====================================================
       МОДАЛЬНОЕ ОКНО
       ===================================================== */

    function showModal() {

        const modal =
            document.getElementById(
                "success-modal"
            );

        if (!modal) {
            return;
        }

        modal.classList.add("active");


        setTimeout(function () {

            modal.classList.remove("active");

        }, 3000);

    }


    /* =====================================================
       ESC — ЗАКРЫТЬ МОДАЛКУ
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape") {
                return;
            }

            const modal =
                document.getElementById(
                    "success-modal"
                );

            if (modal) {
                modal.classList.remove("active");
            }

        }
    );


    /* =====================================================
       АНИМАЦИИ ПРИ СКРОЛЛЕ
       ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");


    if (
        revealElements.length > 0 &&
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "is-visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.1
                }
            );


        revealElements.forEach(
            function (element) {

                observer.observe(element);

            }
        );

    } else {

        revealElements.forEach(
            function (element) {

                element.classList.add(
                    "is-visible"
                );

            }
        );

    }

});
