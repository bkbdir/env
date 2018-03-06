#!/bin/dash



ctx=$(cat "/proc/$(xdotool getwindowpid "$(xdotool getwindowfocus)")/comm")

varedi=$HOME/var/edi
[ -d $varedi ] || mkdir -p $varedi

dofirefox () {
    xdotool search --onlyvisible --classname URxvtWebpad windowunmap \
        || xdotool search --classname URxvtWebpad windowmap \
        || urxvtc -name URxvtWebpad -geometry 10x2
}

dourxvt  () {
    xdotool search --onlyvisible --classname URxvtPrompt windowunmap \
        || xdotool search --classname URxvtPrompt windowmap \
        || urxvtc -name URxvtPrompt -geometry 4x2 -e bash -c "/home/ben/dev/edibin/command.sh"
}

pgrep urxvtd || { 
    urxvtd -q -o -f
    #echo "Err: urxvtd not running"; 
    #exit
    # exit 1; tmux crashes ... 
}

case $ctx in
    firefox)
        dofirefox

    ;;
    urxvt*)
        dourxvt
    ;;
    *)
        echo 'Err: bla' $0
        exit 1 
    ;;
esac


