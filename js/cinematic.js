/* NOSSO PRIMEIRO CAPÍTULO — CINEMATIC V2.0
   Camada visual. Não substitui app.js nem gallery.js. */

document.addEventListener("DOMContentLoaded", function () {

    document.body.classList.add("cinema-mode");

    if (!document.querySelector(".cinema-vignette")) {
        const vignette = document.createElement("div");
        vignette.className = "cinema-vignette";
        document.body.appendChild(vignette);
    }

    const reduced = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) return;

    function particle() {
        const p = document.createElement("span");
        p.className = "cinema-particle";

        const duration = Math.random() * 8 + 7;
        p.style.width = p.style.height = (Math.random() * 2.5 + 1) + "px";
        p.style.left = Math.random() * 100 + "vw";
        p.style.top = (Math.random() * 100 + 10) + "vh";
        p.style.animationDuration = duration + "s";
        p.style.setProperty("--drift", ((Math.random() - .5) * 140) + "px");

        document.body.appendChild(p);

        setTimeout(function () {
            p.remove();
        }, duration * 1000 + 500);
    }

    function burst(qtd) {
        for (let i = 0; i < qtd; i++) {
            setTimeout(particle, i * 45);
        }
    }

    setInterval(particle, 1150);

    const screens = [
        document.getElementById("welcome-screen"),
        document.getElementById("story-screen"),
        document.getElementById("gallery-screen"),
        document.getElementById("surprise-overlay"),
        document.getElementById("final-screen")
    ].filter(Boolean);

    let lastActive = null;

    function detectScreen() {
        const active = screens.find(function (el) {
            return el.classList.contains("active") ||
                   el.classList.contains("show");
        });

        if (active && active !== lastActive) {
            lastActive = active;
            burst(active.id === "final-screen" ? 35 : 10);
        }
    }

    const observer = new MutationObserver(detectScreen);

    screens.forEach(function (el) {
        observer.observe(el, {
            attributes: true,
            attributeFilter: ["class"]
        });
    });

    detectScreen();

    const card = document.querySelector(".gallery-card");

    if (card) {
        let lastImage = "";

        const photoObserver = new MutationObserver(function () {
            const img = card.querySelector("img");
            if (!img) return;

            const src = img.currentSrc || img.src || "";

            if (!src || src === lastImage) return;

            if (lastImage) {
                card.classList.remove("cinema-photo-change");
                void card.offsetWidth;
                card.classList.add("cinema-photo-change");
            }

            lastImage = src;
            card.classList.add("cinema-breathe");
        });

        photoObserver.observe(card, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ["src", "class", "style"]
        });
    }

    const surprise = document.getElementById("surprise-overlay");

    if (surprise) {
        const surpriseObserver = new MutationObserver(function () {
            if (surprise.classList.contains("show")) {
                burst(22);
            }
        });

        surpriseObserver.observe(surprise, {
            attributes: true,
            attributeFilter: ["class"]
        });
    }

    const finalScreen = document.getElementById("final-screen");

    if (finalScreen) {
        const finalObserver = new MutationObserver(function () {
            if (finalScreen.classList.contains("show")) {
                burst(45);

                setTimeout(function () { burst(25); }, 1200);
                setTimeout(function () { burst(20); }, 2600);
            }
        });

        finalObserver.observe(finalScreen, {
            attributes: true,
            attributeFilter: ["class"]
        });
    }
});
