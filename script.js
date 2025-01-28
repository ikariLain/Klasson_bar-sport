// Javascript for hamburger menu
document.addEventListener('DOMContentLoaded', () => {
    const menuOpen = document.querySelector('#menu-open-button');
    const menuClose = document.querySelector('#menu-close-button');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (menuOpen && menuClose && navMenu) {
        menuOpen.addEventListener('click', () => {
            navMenu.style.left = '0';
            body.classList.add('show-mobile-menu');
        });

        menuClose.addEventListener('click', () => {
            navMenu.style.left = '-300px';
            body.classList.remove('show-mobile-menu');
        });
    }
});