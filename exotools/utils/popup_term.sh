#!/usr/bin/env dash

exocode=$HOME/.exo/code

app=$(osascript $exocode/lib/macos/active_app.scpt)

res=$(urxvt -g 80x25+1200+0 -e /bin/bash -c "$@")

osascript -e 'activate "iTerm2"'

echo $app > app

echo $res
