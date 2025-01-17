var chooseMenu = "Game Engine 3";
var language = "en"

/*
var menues = {
    "menu": {
        "Game Engine 3": {

        },
        "Download": {

        },
        "Control": {
            
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
*/

var menues = {
    "menu": {
        "Game Engine 3": {

        },
        "Download": {

        },
        "Control": {
            
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
            "Another": {

            },
            "Set": {

            }
        }
    },

    "menues": {
        
    }
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

async function initialization(){
    var en = await cacheLoadJSON("https://raw.githubusercontent.com/artyom7774/artyom7774.github.io/main/translates/en.json");
    var ru = await cacheLoadJSON("https://raw.githubusercontent.com/artyom7774/artyom7774.github.io/main/translates/ru.json");

    menues["menues"]["en"] = en;
    menues["menues"]["ru"] = ru;

    const menuClass = document.querySelector(".content__menu__choose");

    var text = "";

    for (const key in menues["menu"]){
        var menu = menues["menues"][language][key]["name"];
    
        if (menu == chooseMenu){
            text += `<button class="content__menu__button" onclick="menuButtonFunction('${menu}')">• ${menu}</button>`;
        } else {
            text += `<button class="content__menu__button" onclick="menuButtonFunction('${menu}')">${menu}</button>`;
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
                    text += `<button class="content__menu__button" onclick="menuButtonFunction('${menu}/${element}')">${char}&nbsp;• ${element}</button>`;
                } else {
                    text += `<button class="content__menu__button" onclick="menuButtonFunction('${menu}/${element}')">${char}&nbsp;${element}</button>`;
                }

                index += 1;
            }
        }
    }

    menuClass.innerHTML = text;

    mainInformationView();
}

async function setLanguage(lang) {
    language = lang;

    initialization();
}

document.addEventListener('DOMContentLoaded', function () {
    initialization();
});

let cacheLoadJSON = cache(loadJSON);
