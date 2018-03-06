#!/bin/sh

sess=$(tmux display-message -p '#S')
win=$(tmux display-message -p '#W')
pane=$(tmux display-message -p '#P')

#ediwin=$(tmux display-message -t edishell -p '#W')

tmux command-prompt -t edishell -p "CMD for $sess/$win/$pane:" "run '/home/ben/dev/edibin/command.sh %%'"
