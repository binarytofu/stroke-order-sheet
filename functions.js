if (!localStorage["svg"]) {
    localStorage.setItem("svg", '<svg version="1.1" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" class="hanzi-svg"><g stroke="#c1c1c1" stroke-dasharray="3" stroke-width="3" transform="scale(4, 4)"><line x1="0" y1="0" x2="256" y2="256"></line><line x1="256" y1="0" x2="0" y2="256"></line><line x1="128" y1="0" x2="128" y2="256"></line><line x1="0" y1="128" x2="256" y2="128"></line></g><g transform="scale(1, -1) translate(0, -900)"></g></svg>')
}
if (!localStorage["hanzi-9573"]) {
    var resp = [];
    const Http = new XMLHttpRequest();
    const url = './dictionary.json';
    Http.open("GET", url);
    Http.responseType = 'json';
    Http.send();
    Http.onreadystatechange = (e) => {
        if (Http.readyState == 4 && Http.status == 200) {
            resp = Http.response;
            for (var i = 0; i < resp.length; i++) {
                localStorage.setItem(charId(resp[i]["character"]), JSON.stringify(resp[i]));
            }
            console.log("Dictionary set")
        }
    }
}

function saveDoc() {
    html2canvas(document.getElementById("page")).then(function(canvas) {
        document.body.appendChild(canvas);
    });
}

function charId(hanzi) {
    return hanzi.charCodeAt(0);
}

function createBox(hanzi, ind) {
    var mainG = document.createElement("div");
    var strokes = [];
    mainG.className = "hanzi-box";
    mainG.id = hanzi + "-" + String(ind);
    mainG.innerHTML = localStorage["svg"];
    document.getElementById("sheet-" + hanzi).appendChild(mainG);
}

function fetchStrokes(hanzi) {
    const Http = new XMLHttpRequest();
    const url = './paths/' + hanzi + '.path';
    Http.open("GET", url);
    Http.responseType = 'json';
    Http.send();
    Http.onreadystatechange = (e) => {
        if (Http.readyState == 4 && Http.status == 200) {
            strokeProcessor(hanzi, Http.response)
        }
    }
}

function strokeProcessor(hanzi, strokes) {
    var currentBox = "";
    for (var i = 0; i < strokes.length; i++) {
        createBox(hanzi, i);
        if (i < strokes.length) {
            for (var z = 0; z <= i; z++) {
                currentBox = currentBox + strokes[z];
            }
            document.getElementById(hanzi + "-" + i).firstChild.childNodes[1].innerHTML = currentBox;
        }
    }
    var first = document.createElement("div");
    var mainHanzi = document.getElementById(hanzi + "-0");
    var hanziDef = document.createElement("div");
    hanziDef.className = "hanzi-def";
    hanziDef.id = "hanzi-def-" + hanzi;
    hanziDef.innerHTML = JSON.parse(localStorage[hanzi])["character"] + "&#9;" + JSON.parse(localStorage[hanzi])["pinyin"][0];
    first.className = "hanzi-box full-hanzi";
    first.id = hanzi + "-full";
    first.innerHTML = localStorage["svg"];
    first.firstChild.childNodes[1].innerHTML = currentBox;
    var last = first.cloneNode(true);
    last.className = "hanzi-box last-hanzi";
    mainHanzi.parentNode.insertBefore(hanziDef, mainHanzi);
    mainHanzi.parentNode.insertBefore(first, mainHanzi);
    mainHanzi.parentNode.appendChild(last);
}

function serialize(inText) {
    console.log(inText.split(""))
    for (var i = 0; i < inText.split("").length; i++) {
        var hanzi = inText.split("")[i];
        var mainElem = document.createElement("div");
        mainElem.id = "sheet-" + charId(hanzi);
        mainElem.className = "boxes";
        document.getElementById("sheet").appendChild(mainElem);
        fetchStrokes(charId(hanzi));
    }
}