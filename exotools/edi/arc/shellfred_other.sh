#!/bin/sh

dev=$HOME/dev


sess=$1
win=$2

echo 'Shellfred other'
echo '---------'
echo ''



writectx () {
    [ -d $dev/var ] || mkdir $dev/var
    echo $win > $dev/var/ctx-win
    echo $sess > $dev/var/ctx-sess
}

resume (){
    if [ $? -eq 0 ] ; then 
        tmux display-message "                            OK"
    else
        tmux display-message "Something went wrong $?"
    fi
}

script=$(ls ~/dev/ediutils/ | ~/local/bin/fzf)
[ -n "$script" ] && $dev/ediutils/$script $sess $win 
#2> $dev/var/edi/err


if [ $? -eq 0 ] ; then
    tmux display-message "       ok  successs :-)    :-)"
else
    tmux display-message "      Err.. fail:   $sess $win     "
    tmux run -t ${sess}:${win}.0 "cat $dev/var/edi/err"
fi





