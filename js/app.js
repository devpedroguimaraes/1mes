document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "APP FIRE: carregado"
        );


        // =================================================
        // TELAS
        // =================================================

        const welcomeScreen =
            document.getElementById(
                "welcome-screen"
            );

        const storyScreen =
            document.getElementById(
                "story-screen"
            );

        const galleryScreen =
            document.getElementById(
                "gallery-screen"
            );


        // =================================================
        // BOTÕES
        // =================================================

        const startButton =
            document.getElementById(
                "start-button"
            );

        const continueButton =
            document.getElementById(
                "continue-button"
            );


        // =================================================
        // ELEMENTOS
        // =================================================

        const music =
            document.getElementById(
                "background-music"
            );

        const daysCounter =
            document.getElementById(
                "days-counter"
            );

        const quote =
            document.getElementById(
                "quote"
            );


        // =================================================
        // DATA
        // =================================================

        const inicio =
            new Date(
                "2026-09-13T00:00:00"
            );


        // =================================================
        // FRASES
        // =================================================

        const frases = [

            "Que esse seja apenas o primeiro de muitos capítulos.",

            "Um mês ao seu lado e eu já quero uma vida inteira.",

            "Obrigado por transformar dias comuns em momentos especiais.",

            "Se esse é apenas o começo, mal posso esperar pelo que vem depois.",

            "Eu escolheria você novamente. Todos os dias."

        ];


        // =================================================
        // TROCAR TELA
        // =================================================

        function mostrarTela(tela) {

            if (!tela) {
                return;
            }


            if (welcomeScreen) {

                welcomeScreen.classList.remove(
                    "active"
                );
            }


            if (storyScreen) {

                storyScreen.classList.remove(
                    "active"
                );
            }


            if (galleryScreen) {

                galleryScreen.classList.remove(
                    "active"
                );
            }


            tela.classList.add(
                "active"
            );


            window.scrollTo(
                0,
                0
            );

        }


        // =================================================
        // MUSICA
        // =================================================

        async function startMusic() {

            if (!music) {
                return;
            }


            try {

                music.volume =
                    0.35;


                await music.play();


            } catch (error) {

                console.log(
                    "Áudio bloqueado pelo navegador."
                );

            }

        }


        // =================================================
        // BOTÃO INICIAL
        // =================================================

        if (startButton) {

            startButton.addEventListener(
                "click",
                async function (event) {

                    event.preventDefault();


                    console.log(
                        "BOTÃO INICIAL CLICADO"
                    );


                    await startMusic();


                    mostrarTela(
                        storyScreen
                    );

                }
            );

        }


        // =================================================
        // BOTÃO CONTINUAR
        // =================================================

        if (continueButton) {

            continueButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    console.log(
                        "BOTÃO DA FASE 2 CLICADO"
                    );


                    mostrarTela(
                        galleryScreen
                    );


                    setTimeout(
                        function () {

                            window.dispatchEvent(
                                new CustomEvent(
                                    "gallery:open"
                                )
                            );

                        },
                        100
                    );

                }
            );

        }


        // =================================================
        // CONTADOR DE DIAS
        // =================================================

        function atualizarContador() {

            if (!daysCounter) {
                return;
            }


            const agora =
                new Date();


            if (agora < inicio) {

                daysCounter.textContent =
                    "00";

                return;
            }


            const diferenca =
                agora -
                inicio;


            const dias =
                Math.floor(
                    diferenca /
                    (
                        1000 *
                        60 *
                        60 *
                        24
                    )
                );


            daysCounter.textContent =
                String(dias).padStart(
                    2,
                    "0"
                );

        }


        atualizarContador();


        setInterval(
            atualizarContador,
            60000
        );


        // =================================================
        // FRASES
        // =================================================

        let fraseAtual = 0;


        function trocarFrase() {

            if (!quote) {
                return;
            }


            fraseAtual++;


            if (
                fraseAtual >=
                frases.length
            ) {

                fraseAtual = 0;
            }


            quote.style.opacity =
                "0";


            setTimeout(
                function () {

                    quote.textContent =
                        frases[
                            fraseAtual
                        ];


                    quote.style.opacity =
                        "0.7";

                },
                300
            );

        }


        setInterval(
            trocarFrase,
            5000
        );


        // =================================================
        // ESTADO INICIAL
        // =================================================

        if (welcomeScreen) {

            welcomeScreen.classList.add(
                "active"
            );
        }


        if (storyScreen) {

            storyScreen.classList.remove(
                "active"
            );
        }


        if (galleryScreen) {

            galleryScreen.classList.remove(
                "active"
            );
        }


        console.log(
            "APP PRONTO"
        );

    }
);