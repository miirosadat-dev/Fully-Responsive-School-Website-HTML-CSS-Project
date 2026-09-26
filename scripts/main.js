// Shared site script
// - Accessible mobile nav toggle (with backdrop + Escape-to-close)
// - Scroll-reveal animations for cards/sections
// - Client-side validation for contact / newsletter / comment forms
// - Reads ?status=success|error after a form submission and shows a banner

document.addEventListener("DOMContentLoaded", () => {
    setupNav();
    setupScrollReveal();
    setupFormValidation(document.querySelector(".comment-form"), { intercept: true });
    setupFormValidation(document.querySelector(".contact-form"));
    setupFormValidation(document.querySelector(".newsletter-form"));
    showFormStatusFromUrl();
    markActiveNavLink();
});

/* ----------Mobile navigation------------- */
function setupNav() {
    const navLinks = document.getElementById("navLinks");
    const openBtn = document.querySelector("nav .fa-bars");
    const closeBtn = document.querySelector("nav .fa-times");
    if (!navLinks || !openBtn || !closeBtn) return;

    // Backdrop, created once and reused
    const overlay = document.createElement("div");
    overlay.className = "nav-overlay";
    document.body.appendChild(overlay);

    const showMenu = () => {
        navLinks.style.right = "0";
        overlay.classList.add("is-visible");
        openBtn.setAttribute("aria-expanded", "true");
        closeBtn.focus();
    };

    const hideMenu = () => {
        navLinks.style.right = "";
        overlay.classList.remove("is-visible");
        openBtn.setAttribute("aria-expanded", "false");
    };

    // Make the icon-based toggles keyboard accessible
    [openBtn, closeBtn].forEach((btn) => {
        btn.setAttribute("role", "button");
        btn.setAttribute("tabindex", "0");
    });
    openBtn.setAttribute("aria-label", "Open menu");
    openBtn.setAttribute("aria-expanded", "false");
    closeBtn.setAttribute("aria-label", "Close menu");

    const activate = (fn) => (event) => {
        if (event.type === "click" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            fn();
        }
    };

    openBtn.addEventListener("click", activate(showMenu));
    openBtn.addEventListener("keydown", activate(showMenu));
    closeBtn.addEventListener("click", activate(hideMenu));
    closeBtn.addEventListener("keydown", activate(hideMenu));
    overlay.addEventListener("click", hideMenu);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") hideMenu();
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", hideMenu);
    });
}

function markActiveNavLink() {
    const current = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach((link) => {
        const href = link.getAttribute("href");
        if (href === current) link.classList.add("active");
    });
}

/* ------Scroll reveal---------- */
function setupScrollReveal() {
    const targets = document.querySelectorAll(
        ".course-col, .campus-col, .facilities-col, .testimonial-col"
    );
    if (!targets.length) return;

    targets.forEach((el) => el.classList.add("reveal"));

    if (!("IntersectionObserver" in window)) {
        targets.forEach((el) => el.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    targets.forEach((el) => observer.observe(el));
}

/* -------------------------------------------------------
   Form validation
   options.intercept = true -> fully client-side form (no backend),
   shows an inline success message and resets instead of submitting.
   ------------------------------------------------------- */
function setupFormValidation(form, options = {}) {
    if (!form) return;
    const fields = form.querySelectorAll("[required]");

    const showFieldError = (field) => {
        const group = field.closest(".form-group") || field.parentElement;
        const errorEl = group ? group.querySelector(".field-error") : null;
        if (errorEl) errorEl.textContent = field.validationMessage;
        field.classList.add("invalid");
    };

    const clearFieldError = (field) => {
        const group = field.closest(".form-group") || field.parentElement;
        const errorEl = group ? group.querySelector(".field-error") : null;
        if (errorEl) errorEl.textContent = "";
        field.classList.remove("invalid");
    };

    fields.forEach((field) => {
        field.addEventListener("input", () => {
            if (field.checkValidity()) clearFieldError(field);
        });
    });

    form.addEventListener("submit", (e) => {
        let firstInvalid = null;
        fields.forEach((field) => {
            if (!field.checkValidity()) {
                showFieldError(field);
                if (!firstInvalid) firstInvalid = field;
            } else {
                clearFieldError(field);
            }
        });

        if (firstInvalid) {
            e.preventDefault();
            firstInvalid.focus();
            return;
        }

        if (options.intercept) {
            e.preventDefault();
            const container = form.closest(".comment-box") || form.parentElement || form;
            const msg = container.querySelector(".form-message");
            if (msg) {
                msg.textContent = "Thanks — your comment has been posted for review.";
                msg.classList.remove("error");
                msg.classList.add("success");
                msg.hidden = false;
            }
            form.reset();
        }
    });
}

/*  Post-submit status banner (?status=success / ?status=error) */
function showFormStatusFromUrl() {
    const box = document.getElementById("formStatus");
    if (!box) return;

    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    if (status === "success" || status === "error") {
        box.textContent = box.dataset[status];
        box.classList.add(status);
        box.hidden = false;
        box.scrollIntoView({ behavior: "smooth", block: "center" });

        const url = new URL(window.location.href);
        url.searchParams.delete("status");
        window.history.replaceState({}, "", url);
    }
}