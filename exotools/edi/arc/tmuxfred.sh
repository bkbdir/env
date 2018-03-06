#!/bin/sh

varedi=$HOME/var/edi

sess=$(tmux display -p '#S')
win=$(tmux display -p '#W')
pane=$(tmux display -p '#P')

#[ -n "$1" ] || { echo "usage: fred.sh <command>" ; exit ; }
[ -n "$sess" ] || { echo "Err: no session please run inside tmux"; exit ; }
[ -n "$win" ] || { echo "Err: no window please run inside tmux"; exit ; }

tmux split-window "$HOME/dev/edibin/shellfred '$sess' '$win' '$pane'"

