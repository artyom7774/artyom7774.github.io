var chooseMenu = "Game Engine 3";

var language = "en";
var theme = "light";

let menues = {
    "menu": {
        "Game Engine 3": {

        },
        "Download": {

        },
        "Control": {
            
        },
        "Programming": {

        },
        "Nodes": {
            "Events": {

            },
            "Loops": {

            },
            "Text": {

            },
            "Numbers": {

            },
            "Logic": {

            },
            "Objects": {

            },
            "Animations": {

            },
            "Another": {

            },
            "Set": {

            }
        },
        "Guides": {
            "Start": {

            },
            "First program": {

            },
            "Variables": {

            },
            "Project - Dino": {

            }
        }
    },

    "menues": {
        
    }
}

let anotherTranslates = {
    "ru": {
        "Shell \"Game Engine 3\" software in Python, which allows you to create various applications using visual programming based on a system of nodes": "Программная оболочка \"Game Engine 3\" на языке Python, позволяющая создавать различные приложения с использованием визуального программирования",
        "Download": "Загрузка",
        "Control": "Управление",
        "Nodes": "Ноды",
        "Events": "События",
        "Loops": "Циклы",
        "Text": "Текст",
        "Numbers": "Числа",
        "Logic": "Логика",
        "Objects": "Объекты",
        "Animations": "Анимации",
        "Another": "Другое",
        "Set": "Множество",
        "Guides": "Помощь",
        "Start": "Начало",
        "First program": "Первая программа",
        "Variables": "Переменные",
        "Project - Dino": "Проект - Динозаврик",
        "Programming": "Программирование"
    }
}

let symbolKeysTable = `
<table style="border: 1px solid rgb(0, 0, 0);">
  <thead>
    <tr>
      <th style="border: 1px solid rgb(0, 0, 0);">Header 1</th>
      <th style="border: 1px solid rgb(0, 0, 0);">Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid rgb(0, 0, 0);">vi0ey9</td>
      <td style="border: 1px solid rgb(0, 0, 0);">5e2sg</td>
    </tr>
    <tr>
      <td style="border: 1px solid rgb(0, 0, 0);">6l5yjjh</td>
      <td style="border: 1px solid rgb(0, 0, 0);">wsaedz</td>
    </tr>
    <tr>
      <td style="border: 1px solid rgb(0, 0, 0);">mtedu9</td>
      <td style="border: 1px solid rgb(0, 0, 0);">zd74ph</td>
    </tr>
  </tbody>
</table>
`

function translate(text) {
    if (language == "en"){
        return text;
    }

    if (text in anotherTranslates[language]){
        return anotherTranslates[language][text];
    }
    
    return text;
}

function cache(func) {
    const cache = new Map();

    return function(...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        cache.set(key, func.apply(this, args));

        // console.log("Cache miss for key:", key, "Storing result:", cache.get(key));

        return cache.get(key);
    };
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

async function holder(text){
    version = (await cacheLoadJSON("https://raw.githubusercontent.com/artyom7774/Game-Engine-3/main/scr/files/version.json"))["version"];

    text = await text.replace(/%version%/g, version);
    text = await text.replace(/%symbol-keys-table%/g, symbolKeysTable);

    return text;
}

async function menuButtonFunction(menu){
    chooseMenu = menu;

    initialization();
}

async function mainInformationView(){
    const mainClass = document.querySelector(".content__main");

    var text = "";

    // var text = `<p class="content__main__name">${chooseMenu}</p>`;

    console.log(menues["menues"][language], chooseMenu);

    for (const key in menues["menues"][language][chooseMenu]["text"]){
        var line = menues["menues"][language][chooseMenu]["text"][key];

        if (line == "----------------------------------------------------------------------------------------------------"){
            line = "<br>";
        } else if (line == ""){
            line = "<br>";
        }
        
        if (line[0] == "<" && line[-1] == ">"){
            text += `${await holder(line)}`;
        } else {
            text += `<p class="content__main__discription">${await holder(line)}</p>`;
        }
    }

    console.log(text);

    mainClass.innerHTML = text;
}

async function headerView(){
    const menuHeader = document.querySelector(".header__discription");

    console.log(menuHeader);
    
    menuHeader.innerHTML = translate("Shell \"Game Engine 3\" software in Python, which allows you to create various applications using visual programming based on a system of nodes");
}

async function initialization(){
    menues["menues"]["en"] = (await cacheLoadJSON("https://raw.githubusercontent.com/artyom7774/artyom7774.github.io/main/translates/en.json"));
    menues["menues"]["ru"] = (await cacheLoadJSON("https://raw.githubusercontent.com/artyom7774/artyom7774.github.io/main/translates/ru.json"));

    for (const language in menues["menues"]){
        var nodes = [];

        for (const type in menues["menues"][language]){
            if (!(type.startsWith("Nodes/"))){
                continue;
            }

            for (const index in menues["menues"][language][type]["text"]){
                nodes.push(menues["menues"][language][type]["text"][index]);
            }
        }

        menues["menues"][language]["Nodes"]["text"] = nodes;
    }

    const headerThemeSettingLight = document.querySelector(".header__theme__setting__light");
    const headerThemeSettingDark = document.querySelector(".header__theme__setting__dark");

    headerThemeSettingLight.textContent = 'Новый текст';

    const menuClass = document.querySelector(".content__menu__choose");

    var text = "";

    for (const key in menues["menu"]){
        var menu = menues["menues"][language][key]["name"];
    
        if (menu == chooseMenu){
            text += `<button class="content__menu__button" onclick="menuButtonFunction('${menu}')">• ${translate(menu)}</button>`;
        } else {
            text += `<button class="content__menu__button" onclick="menuButtonFunction('${menu}')">${translate(menu)}</button>`;
        }

        if (Object.keys(menues["menu"][key]).length != 0){
            var index = 0;

            for (const element in menues["menu"][key]){
                console.log(element);

                if (index != Object.keys(menues["menu"][key]).length - 1){
                    var char = "├";
                } else {
                    var char = "└";
                }

                if (`${menu}/${element}` == chooseMenu){
                    text += `<button class="content__menu__button" onclick="menuButtonFunction('${menu}/${element}')">${char}&nbsp;• ${translate(element)}</button>`;
                } else {
                    text += `<button class="content__menu__button" onclick="menuButtonFunction('${menu}/${element}')">${char}&nbsp;${translate(element)}</button>`;
                }

                index += 1;
            }
        }
    }

    menuClass.innerHTML = text;

    mainInformationView();
    headerView();
}

async function setLanguage(lang) {
    language = lang;

    initialization();
}

async function setTheme(them){
    theme = them;

    initialization();
}

document.addEventListener('DOMContentLoaded', function () {
    initialization();
});

let cacheLoadJSON = cache(loadJSON);
