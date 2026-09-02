# love note engine

love note is a toy visual novel engine, kinda reimplementing [love letter](https://solflo.neocities.org/etc/loveletter.html) in javascript, but with less stuff. it's intended as an alternative to (but not a replacement for) lovejs. it's also an alternative engine if you don't have access to love2d.

notes are also like 1mb lighter than letters built as html. in 2026 this is hardly relevant, but it's cute! plus every note is a straightforward redistribution of the engine, which isn't the case for games built with lovejs. also cute!

note scripts work perfectly in letter. the opposite might not be the case, and bugs may be strange and arcane. proceed with caution. like the name implies, love note is meant for simpler and shorter vns. it might not be meant for use at all, honestly, but it was a fun exercise for me.


## using

- script goes in `script.txt`
- images and audio go in their respective folders (or not, this isn't automated. organize as you will)
- configuration is in `conf.js`
- engine is `lovenote.js`. any fancier changes go there

the [syntax highlighter](https://github.com/solflo/loveletter-highlighter) for vscodium / vscode obviously still works.


### syntax

- all commands are preceded by `!`, one command per line
- `!BG name` displays an image at a fixed position. can be hidden with `!BG hide`
- `!SPR name` (sprite) goes on top, at (possibly different) fixed position. can be hidden with `!SPR hide`
- `!MUS name` plays looping audio. can be stopped with `!MUS stop`
- `!SFX name` plays audio once
- `!name` prefixes the line with a nametag, and changes its color
- `!--` comments out the line

love note sanitizes the script so inline html gets treated as normal text. this is so you don't have any problems when using things like \<lesser and greater than symbols\> (also helps with compatibility if using the script as letter!), but if you do wanna use those then ctrl + f `document.getElementById('dialog').innerText = str;` in the engine. you just switch from `innerText` to `innerHTML` (it's also commented over there).


### building

love note does not need to be built, the source (loose files in the directory) is the game. but it can only run on a server — that is, either using something like python's http server (`python3 -m http.server 8000`) or hosting it somewhere online like itchio or your own website.

don't forget to put your game title in `index.html`. the game's visuals can be customized in `stylesheet.css`. this allows for things like media queries for light / dark modes, or better mobile compatibility / responsiveness.


## playing

- `enter`, `down arrow` and `left click` advance text
- `f` toggles fullscreen
- `m` mutes / unmutes


## known errors

love note feels hacky, even more so than letter, but with less moving parts i don't think there's anything too grave. you heard me right folks: right now there are no errors whatsoever. ☝ that i know of.
