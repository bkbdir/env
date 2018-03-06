#!/bin/sh

sess=$1
win=$2
pane=$3


case $sess in 
    *-edit)
    case $pane in
        0)
            tmux  swap-pane -t $sess:$win.$pane -D 
            tmux select-pane -t $sess:$win.- 
            ;;
        1)
            tmux  swap-pane -t $sess:$win.$pane -U 
            tmux select-pane -t $sess:$win.+ 
            ;;
        
        2)
            tmux  swap-pane -t $sess:$win.$pane-D 
            tmux select-pane -t $sess:$win.- 
        ;;
        3)
            tmux  swap-pane -t $sess:$win.$pane -U 
            tmux select-pane -t $sess:$win.+ 
        ;;
        *)
            echo "Err"

        ;;
    esac
        ;;
    *)
        tmux display-message "Err: not in a editor"

        exit 1
        ;;
esac


