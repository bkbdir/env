#!/bin/sh


outer=all

[ -n "$1" ] || { echo "Err: no name" ; exit 1; }
path=$1
name=$(basename $path)

[ -e $path ] || { echo "Err: path not exist"; exit 1; }

tmux new-window -n $name
tmux send-keys -t $outer "cd $path" C-m

tmux send-keys -t $outer 'set TMUX' C-m
tmux send-keys -t $outer "tmux new -s l-$name" C-m
tmux send-keys -t $outer "cd $path" C-m

tmux split-window -t $outer -h 
tmux send-keys -t $outer 'set TMUX' C-m
tmux send-keys -t $outer "tmux new -s r-$name" C-m

tmux send-keys -t r-$name:0 "cd $path" C-m
#tmux send-keys -t $outer C-e |
#tmux send-keys -t $outer 'set TMUX' C-m
#tmux send-keys -t $outer "tmux new -s docs-$name" C-m
#tmux split-window -t r-$name -v 
#tmux send-keys -t r-$name:0.0 C-e | \;
#
#tmux select-pane -L
#
#tmux split-window -t $outer v 



