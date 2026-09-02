// ________________________
// ________________________
// ___ LOVE NOTE ENGINE ___
// ______________ v. 1.0 __
// ________________________

// love note is a toy version of love letter. check the readme or https://solflo.neocities.org/etc/loveletter/lovenote.html for more info.
// some code here is taken straight from freya campbell's [videotome](https://communistsister.itch.io/videotome). 
// since that's under a Attribution-NonCommercial-ShareAlike licence, it's wise to say that so is love note!
// (vt also uses the "CC BY-NC-ND" shorthand, but that's contradictory and i believe a typo? since it goes on to explain:
// "This license lets others remix, adapt, and build upon your work non-commercially, as long as they credit you and license their new creations under the identical terms.")
// in any case: do as you will with love note basically, but selling it in any form is fucking gauche.


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
var isMuted = false;
const cache = {};
const DIVIDER = " | "
//#endregion


//#region setup
async function getFile(fileURL){    
    let fileContent = await fetch(fileURL);
    fileContent = await fileContent.text();
    return fileContent;
}


function parseStory() {
    console.log('getting file');
    let ms = (new Date).getTime(); // epoch time, used to always refresh the script.txt
    // Passing file url 
    getFile('script.txt?=' + ms).then(content =>{
        storyArray = content.trim().split("\n");
        if (debugLogs) console.info(storyArray);
    }).catch(error =>{
        console.log(error);
        console.error("Unable to load script.txt file.");
    });
}


function readyStory() {

    makeMusicPlayers();
    cacheIMGs();
    parseStory();
    
    // progress events
    document.addEventListener('keyup', logKey);
    document.getElementById("game").onclick = function() {progress();};

    console.log('action!');
}
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

}


function makeMusicPlayers() {

    if (debugLogs) console.groupCollapsed("sounds found");
    for (let [key, value] of Object.entries(AUDIO)) {

        if (debugLogs) console.log(`${key}: ${value}`);
        let newplayer = document.createElement("AUDIO");
        newplayer.setAttribute("id", key);
        newplayer.setAttribute("src", value);
        newplayer.setAttribute("preload", "auto");
        newplayer.setAttribute("loop", false);
        // if (key.indexOf('MUS') >= 0) {
        //    newplayer.setAttribute("loop", 1);
        // }
        document.body.appendChild(newplayer);
    };
    if (debugLogs) console.groupEnd();
    console.log('music loaded');

}
//#endregion


//#region keys
function logKey(e) {    
    if (e.key == "Enter" || e.key == " " || e.key == "ArrowDown") {
        progress();
    }

    if (e.key == "f") {
        let game = document.getElementById("game"); // this looks a little goofy
        // let game = document.documentElement;
        toggleFullscreen(game);
    }

    if (e.key == "m") {
        mute();
    }
}
//#endregion


//#region meta controls
// making these functions in case i also want a button or sth (for mobile)
function toggleFullscreen(game) {
  if (!document.fullscreenElement) {
    // If the document is not in full screen mode make it so
    game.requestFullscreen();
  } else {
    // Otherwise exit the full screen
    document.exitFullscreen?.();
  }
}


function mute() {
    isMuted = !isMuted;
    let sounds = document.getElementsByTagName('audio');
    for(i=0; i<sounds.length; i++) sounds[i].muted = isMuted;
}
//#endregion


//#region progression
function progress() {
    if (currentLine < storyArray.length) {
        let str = storyArray[currentLine]; 
        parseTags(str);
    } else if (currentLine == storyArray.length) {
        str = "<EOF>"
        parseTags(str);
        musicPlayer("stop");
        sfxPlayer("stop");
    }
};
//#endregion


//#region syntax
function parseTags(str) {

    document.getElementById('dialog').classList.remove("dialog");

    if (SYNTAX.COMMENT.test(str) == true) { 
        removeLine();
        return;
    }
    
    if (SYNTAX.BG.test(str) == true) { 
        let curBG = str.replace(SYNTAX.BG, "");
        let BGtarget;
        if (curBG == "hide") {
            BGtarget = "";
        } else {
            BGtarget = "url('./" + IMGS[curBG] +"')";
        };
        document.getElementById('background').style.backgroundImage = BGtarget;
        removeLine();
        return;
    }
    
    if (SYNTAX.SPR.test(str) == true) { 
        let curSPR = str.replace(SYNTAX.SPR, "");
        let SPRtarget;
        if (curSPR == "hide") {
            SPRtarget = "";
        } else {
            SPRtarget = "url('./" + IMGS[curSPR] +"')";
        };        
        document.getElementById('sprite').style.backgroundImage = SPRtarget;        
        removeLine();
        return;
    }
    
    if (SYNTAX.MUS.test(str) == true) {
        let curMUS = str.replace(SYNTAX.MUS, "");
        let track = curMUS;
        musicPlayer(track);
        removeLine();
        return;
    }

    if (SYNTAX.SFX.test(str) == true) {
        let curSFX = str.replace(SYNTAX.SFX, "");
        let track = curSFX;
        sfxPlayer(track);
        removeLine();
        return;
    }
    
    if (SYNTAX.CHAR.test(str) == true) {
        let nametag = str.match(SYNTAX.CHAR)[0]; // the first instance of the match        
        let chara = nametag.replace(/^!/, ""); // grabs just the tag without !
        chara = chara.trim();
        chara = CHARS[chara];

        str = str.replace(nametag, chara + DIVIDER);
        document.getElementById('dialog').classList.add("dialog");

        // curiously nothing at all happens if the tag isn't in the CHARS object... not investigating.
    }
    
    document.getElementById('dialog').innerText = str; // innerText sanitizes inputs. alt use innerHTML
    currentLine++;
};


function removeLine(){
    storyArray.splice(currentLine, 1);
    progress();
}
//#endregion


//#region audio functions
function musicPlayer (track) {

    let sounds = document.getElementsByTagName('audio');
    for(i=0; i<sounds.length; i++) sounds[i].pause();

    if (track == "stop") {
        if (debugLogs) console.info('music stopped');
        return;
    }

    let player = document.getElementById(track);
    if (player == null) {
        console.warn("Could not load music with tag " + track + ", did you forget to add it to conf.js?")
    } else {
        // player.setAttribute("loop", true);
        player.loop = true;
        player.play();
        if (debugLogs) console.info('playing music ' + track);
    }

}


function sfxPlayer (track) {

    if (track == "stop") {
        if (debugLogs) console.info('sfx stopped');
        return;
    }

    let player = document.getElementById(track);
    if (player == null) {
        console.warn("Could not load sfx with tag " + track + ", did you forget to add it to conf.js?")
    } else {
        player.currentTime = 0;
        player.loop = false;
        player.play();
        if (debugLogs) console.info('playing sfx ' + track);
    }

}
//#endregion
