# love note engine

love note is a toy visual novel engine, kinda reimplementing [love letter](https://solflo.neocities.org/etc/loveletter.html) in javascript, but with less stuff. it's intended as an alternative to (but not a replacement for) lovejs. it's also an alternative engine if you don't have access to love2d.

notes are also like 1mb lighter than letters built as html. in 2026 this is hardly relevant, but it's cute! plus every note is a straightforward redistribution of the engine, which isn't the case for games built with lovejs. which is also cute!

note scripts work perfectly in letter. the opposite might not be the case, and bugs may be strange and arcane. proceed with caution. like the name implies, love note is meant for simpler and shorter vns. it might not be meant for use at all, honestly.

## using

- script goes in `script.txt`
- images and audio go in their respective folders (or not, this isn't automated. organize as you will)
- configuration is in `conf.js`
- engine is `loveletter.js`. any fancier changes go there

the [syntax highlighter](https://github.com/solflo/loveletter-highlighter) for vscodium / vscode obviously still works.

### syntax

- all commands are preceded by `!`, one command per line
- `!BG name` displays an image at a fixed position. can be hidden with `!BG hide`
- `!SPR name` (sprite) goes on top. can be hidden with `!SPR hide`
- `!MUS name` plays looping audio. can be stopped with `!MUS stop`
- `!SFX name` plays audio once and can't be stopped
- `!name` prefixes the line with a nametag, and changes its color
- `!--` comments out the line

### building

love note does not need to be built, but it can only run on a server — that is, either using something like python's http server (`python3 -m http.server`) or hosting it somewhere online like itchio or your own website.

## playing

- `enter`, `down arrow` and `left click` advance text
- `f` toggles fullscreen

## known errors

love note is HACKY, even more so than letter.
