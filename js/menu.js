
// mobile burger menu
const burgerNav      = document.querySelector('.burger-nav');
const navigationList = document.querySelector('.nav-bar');

burgerNav.addEventListener('click', () => {
    navigationList.classList.toggle("open");
    burgerNav.classList.toggle("open");
});