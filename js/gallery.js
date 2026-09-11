document.addEventListener("DOMContentLoaded", function () {

    console.log("GALLERY FIRE: carregado");


    // =====================================================
    // ELEMENTOS
    // =====================================================

    const wrapper =
        document.getElementById("gallery-wrapper");


    const cards =
        Array.from(
            document.querySelectorAll(".gallery-card")
        );


    const currentCounter =
        document.getElementById("gallery-current");


    const totalCounter =
        document.getElementById("gallery-total");


    const caption =
        document.getElementById("gallery-caption");


    const surpriseOverlay =
        document.getElementById("surprise-overlay");


    const closeSurprise =
        document.getElementById("close-surprise");


    const finalScreen =
        document.getElementById("final-screen");


    if (!wrapper || !cards.length) {

        console.error(
            "Galeria não encontrada."
        );

        return;

    }


    // =====================================================
    // CONFIGURACOES
    // =====================================================

    const total = cards.length;

    const swipeThreshold = 70;

    let currentIndex = 0;

    let startX = 0;

    let currentX = 0;

    let isDragging = false;

    let hasMoved = false;

    let isAnimating = false;

    let surpriseShown = false;

    let finalScreenShown = false;


    const captions = [

        "Nosso primeiro capítulo ❤️",

        "Um momento que eu guardaria para sempre.",

        "Só nós dois. ❤️",

        "Uma memória especial.",

        "Cada momento ao seu lado vale a pena.",

        "Mais uma lembrança para guardar.",

        "Eu gosto de nós.",

        "Que venham muitos outros momentos.",

        "Você deixa tudo mais bonito.",

        "Um pedacinho da nossa história.",

        "Mais uma página da nossa história.",

        "Momentos que ficam para sempre.",

        "E pensar que isso é só o começo...",

        "Chegamos ao nosso primeiro capítulo. ❤️"

    ];


    // =====================================================
    // INDICE CIRCULAR
    // =====================================================

    function normalizeIndex(index) {

        if (index < 0) {

            return total - 1;

        }


        if (index >= total) {

            return 0;

        }


        return index;

    }


    // =====================================================
    // LIMPAR ESTILOS
    // =====================================================

    function clearCardStyles(card) {

        if (!card) return;


        card.style.transform = "";

        card.style.opacity = "";

        card.style.zIndex = "";

    }


    function clearAllCardStyles() {

        cards.forEach(function (card) {

            clearCardStyles(card);

        });

    }


    // =====================================================
    // RENDER
    // =====================================================

    function renderGallery() {

        clearAllCardStyles();


        cards.forEach(function (card, index) {

            card.classList.remove(

                "active",
                "next",
                "previous",
                "dragging",
                "leaving-left",
                "leaving-right",
                "preview-right",
                "preview-left",
                "becoming-active"

            );


            if (index === currentIndex) {

                card.classList.add(
                    "active"
                );

            }


            else if (
                index ===
                normalizeIndex(
                    currentIndex + 1
                )
            ) {

                card.classList.add(
                    "next"
                );

            }


            else if (
                index ===
                normalizeIndex(
                    currentIndex - 1
                )
            ) {

                card.classList.add(
                    "previous"
                );

            }

        });


        updateCounter();

    }


    // =====================================================
    // CONTADOR
    // =====================================================

    function updateCounter() {

        if (currentCounter) {

            currentCounter.classList.remove(
                "counter-change"
            );


            void currentCounter.offsetWidth;


            currentCounter.textContent =
                String(
                    currentIndex + 1
                ).padStart(
                    2,
                    "0"
                );


            currentCounter.classList.add(
                "counter-change"
            );

        }


        if (caption) {

            caption.style.opacity = "0";


            setTimeout(function () {

                caption.textContent =
                    captions[currentIndex] ||
                    "Nosso primeiro capítulo ❤️";


                caption.style.opacity = "1";

            }, 180);

        }

    }


    // =====================================================
    // CORACOES
    // =====================================================

    function createHeartBurst() {

        const amount = 8;


        for (
            let i = 0;
            i < amount;
            i++
        ) {

            const heart =
                document.createElement("span");


            heart.className =
                "gallery-heart";


            heart.textContent =
                Math.random() > 0.5
                    ? "❤️"
                    : "♥";


            heart.style.left =
                `${45 + Math.random() * 10}%`;


            heart.style.top =
                `${42 + Math.random() * 12}%`;


            heart.style.setProperty(
                "--x",
                `${(Math.random() - 0.5) * 280}px`
            );


            heart.style.setProperty(
                "--y",
                `${-80 - Math.random() * 220}px`
            );


            heart.style.setProperty(
                "--delay",
                `${Math.random() * 0.15}s`
            );


            wrapper.appendChild(
                heart
            );


            setTimeout(function () {

                heart.remove();

            }, 1500);

        }

    }


    // =====================================================
    // MUDAR FOTO
    // =====================================================

    function goTo(
        newIndex,
        direction
    ) {

        if (finalScreenShown) {

            return;

        }


        if (isAnimating) {

            return;

        }


        if (
            newIndex ===
            currentIndex
        ) {

            return;

        }


        const activeCard =
            cards[currentIndex];


        const targetCard =
            cards[newIndex];


        if (
            !activeCard ||
            !targetCard
        ) {

            return;

        }


        isAnimating = true;


        targetCard.classList.remove(
            "next",
            "previous"
        );


        targetCard.classList.add(

            direction < 0
                ? "preview-right"
                : "preview-left"

        );


        targetCard.style.zIndex =
            "20";


        requestAnimationFrame(
            function () {


                activeCard.classList.add(

                    direction < 0
                        ? "leaving-left"
                        : "leaving-right"

                );


                targetCard.classList.add(
                    "becoming-active"
                );


            }
        );


        setTimeout(
            function () {

                currentIndex =
                    newIndex;


                renderGallery();


                isAnimating = false;


                createHeartBurst();


                // FOTO14

                if (
                    currentIndex ===
                    total - 1 &&
                    !surpriseShown
                ) {

                    prepareFinalPhoto();

                }

            },
            520
        );

    }


    // =====================================================
    // PROXIMA FOTO
    // =====================================================

    function nextPhoto() {

        if (finalScreenShown) {

            return;

        }


        const nextIndex =
            normalizeIndex(
                currentIndex + 1
            );


        goTo(
            nextIndex,
            1
        );

    }


    // =====================================================
    // FOTO ANTERIOR
    // =====================================================

    function previousPhoto() {

        if (finalScreenShown) {

            return;

        }


        const previousIndex =
            normalizeIndex(
                currentIndex - 1
            );


        goTo(
            previousIndex,
            -1
        );

    }


    // =====================================================
    // ARRASTAR
    // =====================================================

    function startDrag(x) {

        if (isAnimating) {

            return;

        }


        if (finalScreenShown) {

            return;

        }


        startX = x;

        currentX = x;

        isDragging = true;

        hasMoved = false;


        const activeCard =
            cards[currentIndex];


        if (activeCard) {

            activeCard.classList.add(
                "dragging"
            );

        }

    }


    function moveDrag(x) {

        if (
            !isDragging ||
            isAnimating ||
            finalScreenShown
        ) {

            return;

        }


        currentX = x;


        const difference =
            currentX - startX;


        if (
            Math.abs(difference) > 5
        ) {

            hasMoved = true;

        }


        const activeCard =
            cards[currentIndex];


        if (!activeCard) {

            return;

        }


        const rotation =
            difference * 0.035;


        const scale =
            1 -
            Math.min(
                Math.abs(difference) / 1500,
                0.06
            );


        activeCard.style.transform =

            `translate3d(
                ${difference}px,
                0,
                0
            )
            rotate(${rotation}deg)
            scale(${scale})`;


        const direction =
            difference < 0
                ? 1
                : -1;


        const targetIndex =
            normalizeIndex(
                currentIndex + direction
            );


        const targetCard =
            cards[targetIndex];


        if (!targetCard) {

            return;

        }


        const progress =
            Math.min(
                Math.abs(difference) /
                wrapper.offsetWidth,
                1
            );


        targetCard.classList.add(

            direction > 0
                ? "preview-right"
                : "preview-left"

        );


        targetCard.style.zIndex =
            "20";


        const targetX =
            direction > 0
                ? -35 + progress * 35
                : 35 - progress * 35;


        const targetScale =
            0.90 +
            progress * 0.10;


        const targetOpacity =
            0.35 +
            progress * 0.65;


        targetCard.style.transform =

            `translate3d(
                ${targetX}px,
                0,
                0
            )
            scale(${targetScale})`;


        targetCard.style.opacity =
            targetOpacity;


        cards.forEach(
            function (card) {

                if (
                    card !== activeCard &&
                    card !== targetCard
                ) {

                    card.style.opacity =
                        "";

                    card.style.transform =
                        "";

                }

            }
        );

    }


    // =====================================================
    // FINALIZAR ARRASTE
    // =====================================================

    function endDrag() {

        if (!isDragging) {

            return;

        }


        isDragging = false;


        const difference =
            currentX - startX;


        const activeCard =
            cards[currentIndex];


        if (activeCard) {

            activeCard.classList.remove(
                "dragging"
            );

        }


        if (
            Math.abs(difference) >=
            swipeThreshold
        ) {

            if (difference < 0) {

                nextPhoto();

            }

            else {

                previousPhoto();

            }

        }

        else {

            if (activeCard) {

                activeCard.style.transform =
                    "translate3d(0, 0, 0) rotate(0deg) scale(1)";

            }


            const nextIndex =
                difference < 0
                    ? normalizeIndex(
                        currentIndex + 1
                    )
                    : normalizeIndex(
                        currentIndex - 1
                    );


            const targetCard =
                cards[nextIndex];


            if (targetCard) {

                targetCard.style.transform =
                    "";

                targetCard.style.opacity =
                    "";

            }

        }


        setTimeout(
            function () {

                hasMoved = false;

            },
            100
        );

    }


    // =====================================================
    // TOUCH / MOUSE
    // =====================================================

    wrapper.addEventListener(
        "pointerdown",
        function (event) {

            if (
                event.pointerType === "mouse" &&
                event.button !== 0
            ) {

                return;

            }


            startDrag(
                event.clientX
            );


            try {

                wrapper.setPointerCapture(
                    event.pointerId
                );

            }

            catch (error) {}

        }
    );


    wrapper.addEventListener(
        "pointermove",
        function (event) {

            if (!isDragging) {

                return;

            }


            moveDrag(
                event.clientX
            );

        }
    );


    wrapper.addEventListener(
        "pointerup",
        function (event) {

            if (!isDragging) {

                return;

            }


            endDrag();


            try {

                wrapper.releasePointerCapture(
                    event.pointerId
                );

            }

            catch (error) {}

        }
    );


    wrapper.addEventListener(
        "pointercancel",
        function () {

            if (isDragging) {

                endDrag();

            }

        }
    );


    // =====================================================
    // CLIQUE NAS LATERAIS
    // =====================================================

    wrapper.addEventListener(
        "click",
        function (event) {

            if (hasMoved) {

                return;

            }


            if (finalScreenShown) {

                return;

            }


            const rect =
                wrapper.getBoundingClientRect();


            const clickX =
                event.clientX -
                rect.left;


            if (
                clickX <
                rect.width / 2
            ) {

                previousPhoto();

            }

            else {

                nextPhoto();

            }

        }
    );


    // =====================================================
    // TECLADO
    // =====================================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (finalScreenShown) {

                return;

            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                previousPhoto();

            }


            if (
                event.key ===
                "ArrowRight"
            ) {

                nextPhoto();

            }

        }
    );


    // =====================================================
    // ABRIR GALERIA
    // =====================================================

    window.addEventListener(
        "gallery:open",
        function () {

            if (finalScreenShown) {

                return;

            }


            currentIndex = 0;

            surpriseShown = false;


            if (surpriseOverlay) {

                surpriseOverlay.classList.remove(
                    "show"
                );

            }


            renderGallery();

        }
    );


    // =====================================================
    // PREPARAR FOTO14
    // =====================================================

    function prepareFinalPhoto() {

        if (!surpriseOverlay) {

            return;

        }


        setTimeout(
            function () {

                if (finalScreenShown) {

                    return;

                }


                surpriseOverlay.classList.add(
                    "show"
                );


                surpriseShown = true;


                createFinalHearts();

            },
            1100
        );

    }


    // =====================================================
    // CORACOES DA SURPRESA
    // =====================================================

    function createFinalHearts() {

        if (!surpriseOverlay) {

            return;

        }


        for (
            let i = 0;
            i < 18;
            i++
        ) {

            const heart =
                document.createElement(
                    "span"
                );


            heart.className =
                "final-floating-heart";


            heart.textContent =
                i % 2 === 0
                    ? "❤️"
                    : "♥";


            heart.style.left =
                `${Math.random() * 100}%`;


            heart.style.animationDelay =
                `${Math.random() * 1.5}s`;


            heart.style.animationDuration =
                `${4 + Math.random() * 3}s`;


            surpriseOverlay.appendChild(
                heart
            );


            setTimeout(
                function () {

                    heart.remove();

                },
                8000
            );

        }

    }


    // =====================================================
    // BOTAO DA SURPRESA -> TELA FINAL
    // =====================================================

    if (closeSurprise) {

        closeSurprise.addEventListener(
            "click",
            function () {

                console.log(
                    "Abrindo tela final..."
                );


                if (finalScreenShown) {

                    return;

                }


                finalScreenShown = true;


                // Bloqueia o botao

                closeSurprise.disabled =
                    true;


                closeSurprise.style.pointerEvents =
                    "none";


                // Esconde a surpresa

                if (surpriseOverlay) {

                    surpriseOverlay.classList.remove(
                        "show"
                    );

                }


                // Pequena transicao

                setTimeout(
                    function () {

                        if (finalScreen) {

                            finalScreen.classList.add(
                                "show"
                            );

                        }

                    },
                    500
                );


                // Aumenta suavemente a musica

                const music =
                    document.getElementById(
                        "background-music"
                    );


                if (music) {

                    let volume =
                        music.volume;


                    const increaseMusic =
                        setInterval(
                            function () {

                                volume += 0.02;


                                if (
                                    volume >=
                                    0.55
                                ) {

                                    volume =
                                        0.55;


                                    clearInterval(
                                        increaseMusic
                                    );

                                }


                                music.volume =
                                    volume;

                            },
                            100
                        );

                }

            }
        );

    }


    // =====================================================
    // PRE-CARREGAR FOTOS
    // =====================================================

    cards.forEach(
        function (card) {

            const image =
                card.querySelector("img");


            if (!image) {

                return;

            }


            const preload =
                new Image();


            preload.src =
                image.src;

        }
    );


    // =====================================================
    // INICIO
    // =====================================================

    if (totalCounter) {

        totalCounter.textContent =
            String(total).padStart(
                2,
                "0"
            );

    }


    renderGallery();


    console.log(
        "GALERIA PRONTA:",
        total,
        "fotos"
    );

});