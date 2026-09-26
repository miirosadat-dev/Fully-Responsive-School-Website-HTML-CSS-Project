// Shared site script — mobile nav toggle
// Replaces the inline onclick="showMenu()" / onclick="hideMenu()" handlers
// that were previously duplicated at the bottom of every page.

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.getElementById("navLinks");
    const openBtn = document.querySelector("nav .fa-bars");
    const closeBtn = document.querySelector("nav .fa-times");

    if (!navLinks || !openBtn || !closeBtn) return;

    const showMenu = () => {
        navLinks.style.right = "0";
    };

    const hideMenu = () => {
        navLinks.style.right = "-200px";
    };

    openBtn.addEventListener("click", showMenu);
    closeBtn.addEventListener("click", hideMenu);

    // Close the mobile menu automatically when a nav link is clicked
    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", hideMenu);
    });
});