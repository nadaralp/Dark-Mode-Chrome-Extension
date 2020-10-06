/**
 * Local Storage manager + interactions
 */
class LocalStorageManager {
    constructor() {
        this.localStorageKey = "nadar-dark";
    }

    /**
     * @returns {boolean}
     */
    isDarkModeKeyExistent() {
        return !!window.localStorage.getItem(this.localStorageKey);
    }

    /**
     * @returns {void}
     */
    setDarkModeKey() {
        window.localStorage.setItem(this.localStorageKey, "1");
    }

    /**
     * @returns {void}
     */
    removeDarkModeKey() {
        if (this.isDarkModeKeyExistent()) {
            window.localStorage.removeItem(this.localStorageKey);
        }
    }
}


/**
 * Browser local storage manager interactions
 */
class BrowserLocalStorageApiManager extends LocalStorageManager {
    constructor() { super(); }

    /**
     * @returns {void}
     */
    setDarkModeKey() {
        chrome.tabs.executeScript({
            code: `
            window.localStorage.setItem("nadar-dark-browser", "1");
            `
        });
    }

    /**
    * @returns {void}
    */
    removeDarkModeKey() {
        chrome.tabs.executeScript({
            code: `
            window.localStorage.removeItem("nadar-dark-browser");
            `
        });
    }
}


/**
 * DOM elements manager
 */
class DOMElementsRef {
    constructor() {
        this.$switch = document.querySelector(".power-switch");
        this.$checkbox = document.querySelector("input[type='checkbox']");
    }
}



/**
 * Outer page interactor
 */
class PageInteractor {
    constructor() {

    }

    makePageDarkMode() {
        chrome.tabs.executeScript({
            code: `
            document.querySelector("html").style.filter = "invert(1) hue-rotate(180deg)";
            `
        });
    }

    removePageDarkMode() {
        chrome.tabs.executeScript({
            code: `
            document.querySelector("html").style.filter = "initial";
            `
        });
    }
}


// Driver code
const popupLocalStorageManager = new LocalStorageManager();
const browserStorageManager = new BrowserLocalStorageApiManager();
const domElements = new DOMElementsRef();
const pageInteractor = new PageInteractor();

// Switch click event listener
domElements.$switch.addEventListener('click', (e) => {
    if (popupLocalStorageManager.isDarkModeKeyExistent()) {
        popupLocalStorageManager.removeDarkModeKey();
        browserStorageManager.removeDarkModeKey();
        pageInteractor.removePageDarkMode();
        return;
    }

    pageInteractor.makePageDarkMode();
    popupLocalStorageManager.setDarkModeKey();
    browserStorageManager.setDarkModeKey();
});


// On load
window.onload = e => {
    if (popupLocalStorageManager.isDarkModeKeyExistent()) {
        domElements.$checkbox.checked = true;
        pageInteractor.makePageDarkMode();
    }
}