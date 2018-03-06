#!/bin/sh

ctx=$(cat "/proc/$(xdotool getwindowpid "$(xdotool getwindowfocus)")/comm")
varedi=$HOME/var/edi


case $ctx in
    firefox)
        echo $ctx > $varedi/err

    ;;
    chromium-browse)
        echo "im here" | rofi -dmenu

    ;;
    urxvt)
        sess=$(tmux display-message -p '#S')
        win=$(tmux display-message -p '#W')
        pane=$(tmux display-message -p '#P')
        tmux split-window "/home/ben/dev/edibin/shellfred $sess $win $pane"
    ;;
    *)
        echo $ctx > $varedi/err
    ;;
esac
