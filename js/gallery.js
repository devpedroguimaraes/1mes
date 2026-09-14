document.addEventListener("DOMContentLoaded", function () {

    console.log("GALLERY FIRE: carregado");

    // =====================================================
    // ELEMENTOS
    // =====================================================

    const wrapper = document.getElementById("gallery-wrapper");

    const cards = Array.from(
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

        console.error("Galeria não encontrada.");

        return;
    }


    // =====================================================
    // CONFIGURAÇÕES
    // =====================================================

    const total = cards.length;

    const SWIPE_THRESHOLD = 70;

    // Distância máxima usada para o efeito visual
    const MAX_DRAG = 180;

    // Duração da troca de foto
    const TRANSITION_TIME = 360;

    let currentIndex = 0;

    let startX = 0;
    let currentX = 0;

    let isDragging = false;
    let isAnimating = false;

    let hasMoved = false;

    let animationFrame = null;

    let surpriseShown = false;
    let finalScreenShown = false;


    // =====================================================
    // LEGENDAS
    // =====================================================

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
    // ÍNDICE CIRCULAR
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
    // PREPARAR CARTAS
    // =====================================================

    function prepareCards() {

        cards.forEach(function (card) {

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

            card.style.willChange = "transform, opacity";

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


            // FOTO ATUAL
            if (index === currentIndex) {

                card.classList.add("active");

                card.style.zIndex = "10";

            }


            // PRÓXIMA FOTO
            else if (
                index === normalizeIndex(currentIndex + 1)
            ) {

                card.classList.add("next");

                card.style.zIndex = "5";

            }


            // FOTO ANTERIOR
            else if (
                index === normalizeIndex(currentIndex - 1)
            ) {

                card.classList.add("previous");

                card.style.zIndex = "5";

            }


            // DEMAIS FOTOS
            else {

                card.style.zIndex = "1";

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

            currentCounter.textContent =
                String(currentIndex + 1).padStart(2, "0");

            // Pequeno reset sem forçar layout pesado
            requestAnimationFrame(function () {

                currentCounter.classList.add(
                    "counter-change"
                );

            });

        }


        if (caption) {

            caption.style.opacity = "0";

            setTimeout(function () {

                if (!caption) return;

                caption.textContent =
                    captions[currentIndex] ||
                    "Nosso primeiro capítulo ❤️";

                caption.style.opacity = "1";

            }, 140);

        }

    }


    // =====================================================
    // CORAÇÕES
    // =====================================================

    function createHeartBurst() {

        const amount = 6;

        for (let i = 0; i < amount; i++) {

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
                `${(Math.random() - 0.5) * 240}px`
            );

            heart.style.setProperty(
                "--y",
                `${-70 - Math.random() * 200}px`
            );

            heart.style.setProperty(
                "--delay",
                `${Math.random() * 0.12}s`
            );

            wrapper.appendChild(heart);

            setTimeout(function () {

                heart.remove();

            }, 1500);

        }

    }


    // =====================================================
    // APLICAR TRANSFORM
    // =====================================================

    function applyDragTransform() {

        animationFrame = null;

        if (!isDragging || isAnimating) {
            return;
        }


        const activeCard =
            cards[currentIndex];

        if (!activeCard) {
            return;
        }


        let difference =
            currentX - startX;


        // Limita o deslocamento
        if (difference > MAX_DRAG) {
            difference = MAX_DRAG;
        }

        if (difference < -MAX_DRAG) {
            difference = -MAX_DRAG;
        }


        // Marca movimento real
        if (Math.abs(difference) > 6) {
            hasMoved = true;
        }


        // =================================================
        // FOTO ATUAL
        // =================================================

        const rotation =
            difference * 0.018;

        const scale =
            1 -
            Math.min(
                Math.abs(difference) / 2500,
                0.035
            );


        activeCard.style.transform =
            `translate3d(${difference}px, 0, 0) ` +
            `rotate(${rotation}deg) ` +
            `scale(${scale})`;


        // =================================================
        // FOTO VIZINHA
        // =================================================

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


        const wrapperWidth =
            wrapper.clientWidth || window.innerWidth;


        const progress =
            Math.min(
                Math.abs(difference) /
                wrapperWidth,
                1
            );


        // A próxima foto começa ligeiramente afastada
        const targetX =
            direction > 0
                ? 45 - progress * 45
                : -45 + progress * 45;


        const targetScale =
            0.94 +
            progress * 0.06;


        const targetOpacity =
            0.45 +
            progress * 0.55;


        targetCard.style.transform =
            `translate3d(${targetX}px, 0, 0) ` +
            `scale(${targetScale})`;

        targetCard.style.opacity =
            targetOpacity;

        targetCard.style.zIndex =
            "20";

    }


    // =====================================================
    // SOLICITAR ATUALIZAÇÃO
    // =====================================================

    function requestDragUpdate() {

        if (animationFrame !== null) {
            return;
        }

        animationFrame =
            requestAnimationFrame(
                applyDragTransform
            );

    }


    // =====================================================
    // MUDAR FOTO
    // =====================================================

    function goTo(newIndex, direction) {

        if (finalScreenShown) {
            return;
        }


        if (isAnimating) {
            return;
        }


        if (newIndex === currentIndex) {
            return;
        }


        const activeCard =
            cards[currentIndex];

        const targetCard =
            cards[newIndex];


        if (!activeCard || !targetCard) {
            return;
        }


        isAnimating = true;


        // Cancela frame pendente
        if (animationFrame !== null) {

            cancelAnimationFrame(
                animationFrame
            );

            animationFrame = null;

        }


        // Remove estados antigos
        activeCard.classList.remove(
            "dragging"
        );

        targetCard.classList.remove(
            "next",
            "previous"
        );


        // Garante que a foto alvo esteja preparada
        targetCard.style.zIndex = "20";


        targetCard.classList.add(
            direction < 0
                ? "preview-right"
                : "preview-left"
        );


        // Força estado inicial
        const startPosition =
            direction > 0
                ? "translate3d(45px, 0, 0) scale(0.94)"
                : "translate3d(-45px, 0, 0) scale(0.94)";


        targetCard.style.transition =
            "none";

        targetCard.style.transform =
            startPosition;

        targetCard.style.opacity =
            "0.45";


        activeCard.style.transition =
            `transform ${TRANSITION_TIME}ms cubic-bezier(0.22, 1, 0.36, 1), ` +
            `opacity ${TRANSITION_TIME}ms ease`;


        targetCard.style.transition =
            `transform ${TRANSITION_TIME}ms cubic-bezier(0.22, 1, 0.36, 1), ` +
            `opacity ${TRANSITION_TIME}ms ease`;


        requestAnimationFrame(function () {

            // Foto atual sai
            const exitX =
                direction > 0
                    ? "-105%"
                    : "105%";


            activeCard.style.transform =
                `translate3d(${exitX}, 0, 0) ` +
                `rotate(${direction > 0 ? -3 : 3}deg) ` +
                `scale(0.98)`;


            activeCard.style.opacity =
                "0";


            // Nova foto entra
            targetCard.style.transform =
                "translate3d(0, 0, 0) scale(1)";


            targetCard.style.opacity =
                "1";

        });


        setTimeout(function () {

            currentIndex =
                newIndex;


            // Limpa somente as cartas envolvidas
            clearCardStyles(activeCard);
            clearCardStyles(targetCard);


            activeCard.style.transition = "";
            targetCard.style.transition = "";


            renderGallery();


            isAnimating = false;


            createHeartBurst();


            // =================================================
            // FOTO 14
            // =================================================

            if (
                currentIndex === total - 1 &&
                !surpriseShown
            ) {

                prepareFinalPhoto();

            }

        }, TRANSITION_TIME + 30);

    }


    // =====================================================
    // PRÓXIMA FOTO
    // =====================================================

    function nextPhoto() {

        if (finalScreenShown || isAnimating) {
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

        if (finalScreenShown || isAnimating) {
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
    // INICIAR ARRASTE
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


            activeCard.style.transition =
                "none";

        }

    }


    // =====================================================
    // MOVER ARRASTE
    // =====================================================

    function moveDrag(x) {

        if (
            !isDragging ||
            isAnimating ||
            finalScreenShown
        ) {
            return;
        }


        currentX = x;

        requestDragUpdate();

    }


    // =====================================================
    // FINALIZAR ARRASTE
    // =====================================================

    function endDrag() {

        if (!isDragging) {
            return;
        }


        isDragging = false;


        if (animationFrame !== null) {

            cancelAnimationFrame(
                animationFrame
            );

            animationFrame = null;

        }


        const difference =
            currentX - startX;


        const activeCard =
            cards[currentIndex];


        if (activeCard) {

            activeCard.classList.remove(
                "dragging"
            );

        }


        // =================================================
        // SWIPE PARA ESQUERDA
        // =================================================

        if (
            Math.abs(difference) >=
            SWIPE_THRESHOLD
        ) {

            if (difference < 0) {

                nextPhoto();

            }

            else {

                previousPhoto();

            }


            setTimeout(function () {

                hasMoved = false;

            }, TRANSITION_TIME + 100);


            return;
        }


        // =================================================
        // CANCELAR ARRASTE
        // =================================================

        if (activeCard) {

            activeCard.style.transition =
                "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)";


            activeCard.style.transform =
                "translate3d(0, 0, 0) " +
                "rotate(0deg) " +
                "scale(1)";

        }


        const nextIndex =
            difference < 0
                ? normalizeIndex(currentIndex + 1)
                : normalizeIndex(currentIndex - 1);


        const targetCard =
            cards[nextIndex];


        if (targetCard) {

            targetCard.style.transition =
                "transform 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease";


            targetCard.style.transform =
                "";


            targetCard.style.opacity =
                "";

        }


        setTimeout(function () {

            if (activeCard) {

                activeCard.style.transition =
                    "";

            }


            if (targetCard) {

                targetCard.style.transition =
                    "";

            }


            hasMoved = false;

        }, 300);

    }


    // =====================================================
    // POINTER DOWN
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


            if (isAnimating || finalScreenShown) {
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

        },
        {
            passive: true
        }
    );


    // =====================================================
    // POINTER MOVE
    // =====================================================

    wrapper.addEventListener(
        "pointermove",
        function (event) {

            if (!isDragging) {
                return;
            }


            moveDrag(
                event.clientX
            );

        },
        {
            passive: true
        }
    );


    // =====================================================
    // POINTER UP
    // =====================================================

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


    // =====================================================
    // POINTER CANCEL
    // =====================================================

    wrapper.addEventListener(
        "pointercancel",
        function () {

            if (isDragging) {

                endDrag();

            }

        }
    );


    // =====================================================
    // POINTER LEAVE
    // =====================================================

    wrapper.addEventListener(
        "pointerleave",
        function (event) {

            // Somente mouse
            if (
                event.pointerType === "mouse" &&
                isDragging
            ) {

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


            if (
                finalScreenShown ||
                isAnimating
            ) {
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

            if (
                finalScreenShown ||
                isAnimating
            ) {
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
    // PREPARAR FOTO 14
    // =====================================================

    function prepareFinalPhoto() {

        if (!surpriseOverlay) {
            return;
        }


        setTimeout(function () {

            if (finalScreenShown) {
                return;
            }


            surpriseOverlay.classList.add(
                "show"
            );


            surpriseShown = true;


            createFinalHearts();

        }, 900);

    }


    // =====================================================
    // CORAÇÕES DA SURPRESA
    // =====================================================

    function createFinalHearts() {

        if (!surpriseOverlay) {
            return;
        }


        // Limita a quantidade para iPhone
        const amount = 12;


        for (let i = 0; i < amount; i++) {

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


            setTimeout(function () {

                heart.remove();

            }, 8000);

        }

    }


    // =====================================================
    // BOTÃO DA SURPRESA -> TELA FINAL
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


                // Pequena transição
                setTimeout(function () {

                    if (finalScreen) {

                        finalScreen.classList.add(
                            "show"
                        );

                    }

                }, 450);


                // =================================================
                // AUMENTAR MÚSICA
                // =================================================

                const music =
                    document.getElementById(
                        "background-music"
                    );


                if (music) {

                    let volume =
                        music.volume;


                    const targetVolume =
                        0.55;


                    const increaseMusic =
                        setInterval(
                            function () {

                                volume += 0.025;


                                if (
                                    volume >=
                                    targetVolume
                                ) {

                                    volume =
                                        targetVolume;


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
    // PRÉ-CARREGAR FOTOS
    // =====================================================

    function preloadImages() {

        cards.forEach(function (card) {

            const image =
                card.querySelector("img");


            if (!image) {
                return;
            }


            // Prioridade para as primeiras fotos
            image.decoding = "async";


            // Mantém a própria imagem no navegador
            if (
                image.loading ===
                "lazy"
            ) {

                image.loading =
                    "eager";

            }

        });


        // Pré-carrega somente as vizinhas
        // em vez de criar várias imagens duplicadas
        preloadImage(
            currentIndex
        );

        preloadImage(
            normalizeIndex(
                currentIndex + 1
            )
        );

        preloadImage(
            normalizeIndex(
                currentIndex - 1
            )
        );

    }


    function preloadImage(index) {

        const card =
            cards[index];


        if (!card) {
            return;
        }


        const image =
            card.querySelector("img");


        if (!image) {
            return;
        }


        if (
            image.complete &&
            image.naturalWidth > 0
        ) {
            return;
        }


        image.loading =
            "eager";

    }


    // =====================================================
    // PRÉ-CARREGAR PRÓXIMAS FOTOS
    // =====================================================

    function preloadAroundCurrent() {

        preloadImage(
            currentIndex
        );


        preloadImage(
            normalizeIndex(
                currentIndex + 1
            )
        );


        preloadImage(
            normalizeIndex(
                currentIndex - 1
            )
        );

    }


    // =====================================================
    // ATUALIZAR APÓS TROCA
    // =====================================================

    const originalRender =
        renderGallery;


    // =====================================================
    // INICIALIZAÇÃO
    // =====================================================

    prepareCards();


    if (totalCounter) {

        totalCounter.textContent =
            String(total).padStart(
                2,
                "0"
            );

    }


    renderGallery();


    preloadImages();


    console.log(
        "GALERIA PRONTA:",
        total,
        "fotos"
    );

});