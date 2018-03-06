#!/bin/bash


dev=$HOME/dev

echo 'Vimfred'
echo '---------'
echo ''


echo "ln: ouderedi new window"
echo "pw: generate a twik password"
echo "vs: vim serverlist"
echo "ts: tmux list-sessions"

read -n 2 -s input

echo ""
echo "__________________ $input ____________________"
echo ""



case $input in
    ts)
        tmux list-sessions 
        #| while read v; do printf "$v, " ; done
        echo ""
        read -n 1 -p "Press key ..."
        ;;
    vs)
        vim --serverlist
        echo ""
        read -n 1 -p "Press key ..."
        ;;
    ln)
        perl $HOME/dev/edibin/tmux-newwin-edishell.pl
        ;;
    pw)
        echo "Twik Master please"
        read -s master
        echo "Token please"
        read token

        perl $dev/secutils/passwords_benv141001.1.pl "$token" 'ben.A_special25v141001.1' "$master" | xclip -selection clipboard
        ;;

#bind-key -n C-k  send-prefix \; send-keys C-z 
    *)
        echo "buuu"
        ;;
esac

if [ $? -eq 0 ] ; then 
    tmux display-message "OK"
else
    tmux display-message "Something went wrong $?"
fi


exit
