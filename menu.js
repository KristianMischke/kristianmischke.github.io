
// mobile burger menu
const burgerNav      = document.querySelector('.burger-nav');
const navigationList = document.querySelector('.nav-bar');

burgerNav.addEventListener('click', () => {
    navigationList.classList.toggle("open");
    burgerNav.classList.toggle("open");
});



// nav bg home
var headerHeight = window.innerHeight/2;
var lastScrollY = 0;

window.addEventListener("scroll", () => {

    // set the height that it should switch colors
    headerHeight = window.innerHeight/2
    if(window.innerWidth < 650) {
        headerHeight -= burgerNav.clientHeight;
    } else {
        headerHeight -= navigationList.clientHeight;

        //subtract extra, because the words overlap the title, making it hard to read;
        headerHeight /= 3;
    }

    if (window.scrollY > headerHeight && lastScrollY <= headerHeight) {
        burgerNav.classList.add('scrolled');
        navigationList.classList.add('scrolled');
    } else if (window.scrollY <= headerHeight && lastScrollY > headerHeight) {
        burgerNav.classList.remove('scrolled');
        navigationList.classList.remove('scrolled');
    }

    lastScrollY = window.scrollY;

});