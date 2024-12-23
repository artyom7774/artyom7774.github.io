function cache(func) {
    const cache = new Map();

    return function(...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        cache.set(key, func.apply(this, args));

        console.log("Cache miss for key:", key, "Storing result:", cache.get(key));

        return cache.get(key);
    };
}

async function translate(word) {
    if (word.length === 0) {
        return "";
    }

    let point = false;

    if (word[0] === '-') {
        word = word.slice(1);
        point = true;
    }

    let spaces = 0;

    while (word[0] === ' ') {
        word = word.slice(1);
        spaces += 1;
    }

    if (language == "en"){
        return (point ? '•' : '') + ' '.repeat(spaces) + word;
    }

    bundle = await cacheGetBundle(language);

    // console.log(word, ' '.repeat(spaces) + word in bundle, word in bundle);

    var answer = "";

    if (' '.repeat(spaces) + word in bundle) {
        return bundle[' '.repeat(spaces) + word];
    } else if (word in bundle) {
        answer = bundle[word];
    } else {
        answer = word;
    }

    return (point ? '•' : '') + ' '.repeat(spaces) + answer;
}

async function loadJSON(filePath) {
    try {
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error("Сеть не в порядке: " + response.statusText);
        }

        const data = await response.json();

        return data;

    } catch (error) {
        console.error("Ошибка загрузки JSON:", error);
    }
}

async function getHelpMenu() {
    help = await cacheLoadJSON("https://raw.githubusercontent.com/artyom7774/Game-Engine-3/main/scr/site/help.json");

    version = await cacheLoadJSON("https://raw.githubusercontent.com/artyom7774/Game-Engine-3/main/scr/files/version.json");

    link = `https://github.com/artyom7774/Game-Engine-3/releases/download/GE${version["version"]}/Game.Engine.3.sfx.exe`;

    help["Main"]["pages"]["2"] = {
        "title": "Downloads",
        "text": [
            "Github - <a href='https://github.com/artyom7774/Game-Engine-3'>https://github.com/artyom7774/Game-Engine-3</a>",
            "Github releases - <a href='https://github.com/artyom7774/Game-Engine-3/releases'>https://github.com/artyom7774/Game-Engine-3/releases</a>",
            "",
            `Download - <a href='${link}'>${link}</a>`
        ]
    }

    return help;
}

async function getBundle(language) {
    bundle = await cacheLoadJSON(`https://raw.githubusercontent.com/artyom7774/Game-Engine-3/main/scr/files/bundles/json/${language}.json`);

    return bundle;
}

async function loadHelpMenu(menu, submenu) {
    help = await getHelpMenu()

    // console.log(help)

    now = help[menu];

    for (const key in now["pages"]) {
        if (now["pages"][key]["title"] === submenu) {
            now = now["pages"][key];
            break;
        }
    }

    variables = [];

    text = await translate(now["title"])

    variables.push(`<p class="big-help-text">\t${text}</p>`);

    for (const key in now["text"]) {
        text = await translate(now["text"][key])

        variables.push(`<p class="help-text">${text}</p>`);
    }

    text = "";

    for (const index in variables) {
        text += variables[index];
    }

    text = `<div>` + text + "</div>";

    return text;
};

async function initialization(){
    languageDislay();

    const contentClass = document.querySelector(".content");
    const contentMenu = document.querySelector(".menu");
    
    // INIT MENU ELEMENTS

    help = await getHelpMenu()

    text = "";

    for (const name in help) {
        variable = await translate(help[name]["name"])

        text += `<li class="menu-submenu" id="${help[name]["name"]}">${variable}`;

        index = 0;

        for (const page in help[name]["pages"]) {
            text += `<div class="menu-submenu-element">`;

            if (Object.keys(help[name]["pages"]).length - 1 === index) {
                text += `<svg height="30" width="26"><polyline points="10,0 10,15 25,15" style="fill:none;stroke:white;stroke-width:1" /></svg>`;
            } else {
                text += `<svg height="30" width="26"><polyline points="10,0 10,15 25,15 10,15 10,30" style="fill:none;stroke:white;stroke-width:1" /></svg>`;
            }

            variable = await translate(help[name]["pages"][page]["title"])

            text += `<p class="menu-submenu-item" id="${help[name]["pages"][page]["title"]}">${variable}</p>`;
            text += `</div>`;

            index += 1;
        }

        text += `</li>`
    }

    contentMenu.innerHTML = text;

    // SET START CONTENT TEXT

    const submenu = document.getElementById("Game Engine 3");
    const menu = submenu.parentElement.parentElement;

    contentClass.innerHTML = await loadHelpMenu(menu.id, submenu.id);

    // FINISH

    addMenuEventListeners();
};

function languageDislay() {
    if (language == "ru") {
        document.getElementById("ru").checked = true;
    } else if (language == "en") {
        document.getElementById("en").checked = true;
    }
}

function languageChooseRussian() {
    language = "ru";

    initialization();
}

function languageChooseEnglish() {
    language = "en";

    initialization();
}

function addMenuEventListeners() {
    document.querySelectorAll(".menu-submenu-item").forEach(item => {
        item.addEventListener("click", async event => {
            const content = document.querySelector(".content");

            const submenu = document.getElementById(event.currentTarget.id);
            const menu = submenu.parentElement.parentElement;

            const text = await loadHelpMenu(menu.id, submenu.id);
            content.innerHTML = text;
        });
    });
};

// INITIALIZE

let cacheLoadJSON = cache(loadJSON);
let cacheGetBundle = cache(getBundle)

// VARIABLES

var language = "en";

// START

document.addEventListener('DOMContentLoaded', function () {
    initialization();
});
