
const header = document.querySelector('header');
const main   = document.querySelector('main .content');
const footer = document.querySelector('footer');

var fitContent;

window.onresize = fitMainContent;
window.onload = fitMainContent;

function fitMainContent() {

    fitContent = window.innerHeight - header.clientHeight - footer.clientHeight;

    if(main.clientHeight < fitContent) {
        main.style.height = fitContent + "px";
    }

}