/* =========================================================
   EFEITOS VISUAIS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("particles-container");

    if (!container) return;

    const symbols = ["❤️", "♡", "✦", "·"];

    function createParticle() {

        const particle = document.createElement("span");

        particle.className = "particle";
        particle.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        particle.style.left =
            `${Math.random() * 100}%`;

        particle.style.fontSize =
            `${8 + Math.random() * 12}px`;

        particle.style.setProperty(
            "--duration",
            `${5 + Math.random() * 6}s`
        );

        particle.style.animationDelay =
            `${Math.random() * 1.5}s`;

        container.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 13000);
    }

    for (let i = 0; i < 12; i++) {
        setTimeout(createParticle, i * 250);
    }

    setInterval(createParticle, 700);

    document.addEventListener("click", event => {

        if (
            event.target.closest("button") ||
            event.target.closest(".gallery-wrapper")
        ) {
            return;
        }

        const heart = document.createElement("span");

        heart.textContent = "❤️";
        heart.style.position = "fixed";
        heart.style.left = `${event.clientX}px`;
        heart.style.top = `${event.clientY}px`;
        heart.style.zIndex = "100";
        heart.style.pointerEvents = "none";
        heart.style.fontSize = "18px";
        heart.style.transform = "translate(-50%, -50%)";
        heart.style.transition =
            "transform .8s ease, opacity .8s ease";

        document.body.appendChild(heart);

        requestAnimationFrame(() => {
            heart.style.transform =
                "translate(-50%, -100px) scale(1.5)";
            heart.style.opacity = "0";
        });

        setTimeout(() => heart.remove(), 900);
    });
});
