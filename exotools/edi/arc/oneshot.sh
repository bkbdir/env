#!/bin/bash

echo notepad

read -n 2 res

case $res in
    np)
        #vim  --servername READER --remote-silent ~/dev/notepad.md 
        cat "/proc/$(xdotool getwindowpid "$(xdotool getwindowfocus)")/comm"  | rofi -dmenu
        ;;
    *)
        exit
        ;;
esac
        
