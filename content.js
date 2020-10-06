
const localStorageKey = "nadar-dark-browser";

// if dark mode key exists
if (window.localStorage.getItem(localStorageKey)) {
    document.querySelector("html").style.filter = "invert(1) hue-rotate(180deg)";
}