#!/bin/bash


sess=$(tmux display-message -p '#S')

echo 'Innerfred'
echo '---------'
echo ''




echo "ln: new window for session $sess"


read -n 2 input


case $input in
    ln)
        perl $HOME/dev/edibin/tmux-newwin-edishell.pl
        ;;

#bind-key -n C-k  send-prefix \; send-keys C-z 
    *)
        echo "buuu"
        ;;
esac



exit
