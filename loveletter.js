// ////////////////////////
// /// LOVE NOTE ENGINE ///
// ////////////// v. 0.1 //
// ////////////////////////

//#region regex
const SYNTAX = {
    CHAR: /^!([a-zA-Z]+) /,
    BG: /^!BG /,
    SPR: /^!SPR /,
    MUS: /^!MUS /,
    SFX: /^!SFX /,
    COMMENT: /^!-- .*/,
}
//#endregion


//#region variables
var currentLine = 0;
var storyArray = [];
var debugLogs = true;
var isSyntax = false;
const startingMessage = "whatever";
const cache = {};
const DIVIDER = " | "
//#endregion


//#region setup
async function getFile(fileURL){    
    let fileContent = await fetch(fileURL);
    fileContent = await fileContent.text();
    return fileContent;
};


function parseStory() {
    console.log('getting file');
    // Passing file url 
    getFile('script.txt').then(content =>{
        storyArray = content.trim().split("\n");
        // storyArray.splice(0, 0, "filler!")

        if (debugLogs) console.info(storyArray);
    }).catch(error =>{
        console.log(error);
        console.error("Unable to load script.txt file.");
    });
};


function readyStory() {

    // get the story from story.txt and turn it into array
    parseStory();
    makeMusicPlayers();
    cacheIMGs();
    
    // progress events
    document.addEventListener('keyup', logKey);
    document.getElementById("game").onclick = function() {progress();};

    console.log('action!');
};
//#endregion


//#region asset creation
function cacheIMGs() {

    if (debugLogs) console.groupCollapsed("images found");
    for (let [key, value] of Object.entries(IMGS)) {
        
        if (debugLogs) console.log(`${key}: ${value}`);
        let newimage = document.createElement("img");
        newimage.setAttribute("id", key);
        newimage.setAttribute("src", value);
        newimage.setAttribute("hidden", 1);
        cache[key] = newimage;
    };
    if (debugLogs) console.groupEnd();
    console.log('images loaded');
    
    if (debugLogs) console.info(cache);

};


function makeMusicPlayers() {

    if (debugLogs) console.groupCollapsed("sounds found");
    for (let [key, value] of Object.entries(AUDIO)) {

        if (debugLogs) console.log(`${key}: ${value}`);
        let newplayer = document.createElement("AUDIO");
        newplayer.setAttribute("id", key);
        newplayer.setAttribute("src", value);
        newplayer.setAttribute("preload", "auto");
        // if (key.indexOf('MUS') >= 0) {
        //    newplayer.setAttribute("loop", 1);
        // }
        document.body.appendChild(newplayer);
    };
    if (debugLogs) console.groupEnd();
    console.log('music loaded');

};
//#endregion


//#region keys
function logKey(e) {    
    if (e.key == "Enter" || e.key == " " || e.key == "ArrowDown") {
        // space / enter / down arrow, progress
        progress();
    };
};
//#endregion


//#region progression
function progress() {
    if (currentLine < storyArray.length) {
        let str = storyArray[currentLine]; 
        parseTags(str);
    } else if (currentLine == storyArray.length) {
        str = "<EOF>"
        parseTags(str);
    }
};
//#endregion


//#region syntax
function parseTags(str) {

    if (SYNTAX.COMMENT.test(str) == true) { 
        removeLine();
        return;
    };
    
    if (SYNTAX.BG.test(str) == true) { 
        let curBG = str.replace(SYNTAX.BG, "");
        var BGtarget;
        if (curBG == "hide") {
            BGtarget = "";
        } else {
            BGtarget = "url('./" + IMGS[curBG] +"')";
        };
        document.getElementById('background').style.backgroundImage = BGtarget;
        removeLine();
        return;
    };
    
    if (SYNTAX.SPR.test(str) == true) { 
        let curSPR = str.replace(SYNTAX.SPR, "");
        var SPRtarget;
        if (curSPR == "hide") {
            SPRtarget = "";
        } else {
            SPRtarget = "url('./" + IMGS[curSPR] +"')";
        };        
        document.getElementById('sprite').style.backgroundImage = SPRtarget;        
        removeLine();
        return;
    };
    
    if (SYNTAX.MUS.test(str) == true) {
        // let curMUS = str.replace(SYNTAX.MUS, "");
        // var MUStarget;
        // MUStarget = curMUS;
        // document.getElementById('MUStarget').setAttribute("loop", 1);
        removeLine();
        return;
    };
    
    if (SYNTAX.CHAR.test(str) == true) {
        let nametag = str.match(SYNTAX.CHAR)[0]; // the first instance of the match        
        chara = nametag.replace(/^!/, ""); // grabs just the tag without !
        chara = chara.trim();
        // nametag = "'" + nametag + "'";
        // console.log(nametag);

        // chara = CHARS[chara];

        // if (chara) {
        //     str = str.replace()
        // } else {
        //     console.warn("warning: character tag not recognised. check it's set up correctly in conf.js")
        // };

        str = str.replace(nametag, chara + DIVIDER);
        document.getElementById('dialog').classList.add("dialog");
    };
    
    document.getElementById('dialog').innerText = str;
    currentLine++;
};


function removeLine(){
    storyArray.splice(currentLine, 1);
    progress();
};
//#endregion