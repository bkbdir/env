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
        tmux run -t output "sh /home/ben/dev/edibin/tmux-swap-pane.sh $sess $win $pane"
    ;;
    *)
        echo $ctx > $varedi/err
    ;;
esac
