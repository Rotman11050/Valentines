const cards = document.querySelectorAll(".reveal");

const io = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("is-visible");
            else entry.target.classList.remove("is-visible");
        });
    },
    {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px"
    }
);

cards.forEach((c) => io.observe(c));

/* ---------- Card image sliders (multiple images + swipe) ---------- */
function initSliders() {
    document.querySelectorAll("[data-slider]").forEach((slider) => {
        const track = slider.querySelector(".slider__track");
        const dotsEl = slider.querySelector(".slider__dots");
        if (!track || !dotsEl) return;

        const slides = Array.from(track.querySelectorAll(".slide"));
        const total = slides.length;

        if (total <= 1) {
            dotsEl.hidden = true;
            return;
        }

        const wrap = document.createElement("div");
        wrap.className = "slider__wrap";
        track.parentNode.insertBefore(wrap, track);
        wrap.appendChild(track);

        const prevBtn = document.createElement("button");
        prevBtn.type = "button";
        prevBtn.className = "slider__arrow slider__arrow--prev";
        prevBtn.setAttribute("aria-label", "Previous image");
        prevBtn.innerHTML = "&#10094;";
        const nextBtn = document.createElement("button");
        nextBtn.type = "button";
        nextBtn.className = "slider__arrow slider__arrow--next";
        nextBtn.setAttribute("aria-label", "Next image");
        nextBtn.innerHTML = "&#10095;";
        wrap.appendChild(prevBtn);
        wrap.appendChild(nextBtn);

        prevBtn.addEventListener("click", () => goTo(index - 1));
        nextBtn.addEventListener("click", () => goTo(index + 1));

        track.style.setProperty("--slide-count", total);
        track.style.width = `${total * 100}%`;

        let index = 0;
        let startX = 0;
        let currentX = 0;

        function goTo(i) {
            index = Math.max(0, Math.min(i, total - 1));
            const percentPerSlide = 100 / total;
            track.style.transform = `translateX(-${index * percentPerSlide}%)`;
            dotsEl.querySelectorAll(".slider__dot").forEach((dot, j) => {
                dot.setAttribute("aria-selected", j === index ? "true" : "false");
            });
        }

        dotsEl.querySelectorAll(".slider__dot").forEach((dot, i) => {
            dot.addEventListener("click", () => goTo(i));
        });

        function onPointerStart(e) {
            startX = "touches" in e ? e.touches[0].clientX : e.clientX;
            currentX = startX;
        }

        function onPointerMove(e) {
            currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
        }

        function onPointerEnd() {
            const diff = startX - currentX;
            const threshold = 50;
            if (diff > threshold) goTo(index + 1);
            else if (diff < -threshold) goTo(index - 1);
        }

        slider.addEventListener("touchstart", onPointerStart, { passive: true });
        slider.addEventListener("touchmove", onPointerMove, { passive: true });
        slider.addEventListener("touchend", onPointerEnd);

        slider.addEventListener("mousedown", onPointerStart);
        slider.addEventListener("mousemove", (e) => {
            if (e.buttons !== 1) return;
            onPointerMove(e);
        });
        slider.addEventListener("mouseup", onPointerEnd);
        slider.addEventListener("mouseleave", onPointerEnd);
    });
}

function buildDots() {
    document.querySelectorAll("[data-slider]").forEach((slider) => {
        const track = slider.querySelector(".slider__track");
        const dotsEl = slider.querySelector(".slider__dots");
        if (!track || !dotsEl) return;

        const slides = track.querySelectorAll(".slide");
        if (slides.length <= 1) return;

        dotsEl.innerHTML = "";
        slides.forEach((_, i) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "slider__dot";
            btn.setAttribute("role", "tab");
            btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
            btn.setAttribute("aria-label", `Image ${i + 1} of ${slides.length}`);
            dotsEl.appendChild(btn);
        });
    });
}

buildDots();
initSliders();

/* ---------- Playful final buttons ---------- */
const yesButton = document.querySelector(".final__button");
const noButton = document.querySelector(".final__button--no");

if (yesButton && noButton) {
    let loveScale = 1;

    function growLove() {
        loveScale += 0.08;
        yesButton.style.setProperty("--love-scale", loveScale.toString());
    }

    function dodge(event) {
        event.preventDefault();

        const btnRect = noButton.getBoundingClientRect();
        const padding = 16;
        const maxX = window.innerWidth - btnRect.width - padding;
        const maxY = window.innerHeight - btnRect.height - padding;

        const x = Math.random() * (maxX - padding) + padding;
        const y = Math.random() * (maxY - padding) + padding;

        noButton.style.position = "fixed";
        noButton.style.left = `${x}px`;
        noButton.style.top = `${y}px`;

        growLove();
    }

    noButton.addEventListener("pointerenter", dodge);
    noButton.addEventListener("click", dodge);
}
