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

class BrowserLocalStorageApiManager extends LocalStorageManager {

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
const localStorageManager = new LocalStorageManager();
const domElements = new DOMElementsRef();
const pageInteractor = new PageInteractor();

domElements.$switch.addEventListener('click', (e) => {
    if (localStorageManager.isDarkModeKeyExistent()) {
        localStorageManager.removeDarkModeKey();
        pageInteractor.removePageDarkMode();
        return;
    }

    pageInteractor.makePageDarkMode();
    localStorageManager.setDarkModeKey();
});


// On load
window.onload = e => {
    if (localStorageManager.isDarkModeKeyExistent()) {
        domElements.$checkbox.checked = true;
        pageInteractor.makePageDarkMode();
    }
}