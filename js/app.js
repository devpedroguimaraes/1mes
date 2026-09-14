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

        const hoursCounter =
            document.getElementById(
                "hours-counter"
            );

        const minutesCounter =
            document.getElementById(
                "minutes-counter"
            );

        const secondsCounter =
            document.getElementById(
                "seconds-counter"
            );

        const quote =
            document.getElementById(
                "quote"
            );


        // =================================================
        // DATA DE INÍCIO DO RELACIONAMENTO
        // =================================================

        /*
            ALTERE APENAS ESTA LINHA CASO
            QUEIRA MUDAR A DATA/HORA.

            Atualmente:
            13/09/2026 às 00:00
        */

        const inicio =
            new Date(
                "2026-08-13T17:00:00"
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


                /*
                    O play acontece dentro do clique
                    do botão inicial.

                    Isso aumenta bastante a chance
                    de funcionar no iPhone/Safari.
                */

                await music.play();


                console.log(
                    "Música iniciada."
                );


            } catch (error) {

                console.log(
                    "Áudio bloqueado pelo navegador.",
                    error
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


                    /*
                        Primeiro inicia a música.
                    */

                    await startMusic();


                    /*
                        Depois abre a história.
                    */

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


                    /*
                        Informa para a galeria
                        que ela foi aberta.
                    */

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
        // CONTADOR COMPLETO
        // =================================================

        function atualizarContador() {

            /*
                Verifica se todos os elementos
                existem antes de continuar.
            */

            if (
                !daysCounter ||
                !hoursCounter ||
                !minutesCounter ||
                !secondsCounter
            ) {
                return;
            }


            const agora =
                new Date();


            /*
                Caso a data atual seja anterior
                à data de início.
            */

            if (
                agora <
                inicio
            ) {

                daysCounter.textContent =
                    "00";

                hoursCounter.textContent =
                    "00";

                minutesCounter.textContent =
                    "00";

                secondsCounter.textContent =
                    "00";

                return;

            }


            /*
                Diferença em milissegundos.
            */

            const diferenca =
                agora.getTime() -
                inicio.getTime();


            /*
                Converte para segundos.
            */

            const totalSegundos =
                Math.floor(
                    diferenca /
                    1000
                );


            /*
                1 dia = 86.400 segundos.
            */

            const dias =
                Math.floor(
                    totalSegundos /
                    86400
                );


            /*
                Pega somente as horas
                restantes depois dos dias.
            */

            const horas =
                Math.floor(
                    (
                        totalSegundos %
                        86400
                    ) /
                    3600
                );


            /*
                Pega somente os minutos
                restantes depois das horas.
            */

            const minutos =
                Math.floor(
                    (
                        totalSegundos %
                        3600
                    ) /
                    60
                );


            /*
                Pega os segundos restantes.
            */

            const segundos =
                totalSegundos %
                60;


            /*
                Atualiza DIAS.
            */

            daysCounter.textContent =
                String(
                    dias
                ).padStart(
                    2,
                    "0"
                );


            /*
                Atualiza HORAS.
            */

            hoursCounter.textContent =
                String(
                    horas
                ).padStart(
                    2,
                    "0"
                );


            /*
                Atualiza MINUTOS.
            */

            minutesCounter.textContent =
                String(
                    minutos
                ).padStart(
                    2,
                    "0"
                );


            /*
                Atualiza SEGUNDOS.
            */

            secondsCounter.textContent =
                String(
                    segundos
                ).padStart(
                    2,
                    "0"
                );

        }


        /*
            Executa imediatamente.
        */

        atualizarContador();


        /*
            Atualiza a cada 1 segundo.
        */

        setInterval(
            atualizarContador,
            1000
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


        // =================================================
        // FINALIZAÇÃO
        // =================================================

        console.log(
            "APP PRONTO"
        );

    }
);