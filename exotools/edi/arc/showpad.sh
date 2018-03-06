#!/bin/dash



ctx=$(cat "/proc/$(xdotool getwindowpid "$(xdotool getwindowfocus)")/comm")

varedi=$HOME/var/edi
[ -d $varedi ] || mkdir -p $varedi

dofirefox () {
    xdotool search --onlyvisible --classname URxvtWebpad windowunmap \
        || xdotool search --classname URxvtWebpad windowmap \
        || urxvtc -name URxvtWebpad -geometry 100x20
}

dourxvt  () {
    xdotool search --onlyvisible --classname URxvtScratchpad windowunmap \
        || xdotool search --classname URxvtScratchpad windowmap \
        || urxvtc -name URxvtScratchpad -geometry 100x20
}

case $ctx in
    firefox)
        dofirefox

    ;;
    urxvt)
        dourxvt
    ;;
    *)
    xdotool search --onlyvisible --classname URxvtScratchpad windowunmap \
        || xdotool search --onlyvisible --classname URxvtWebpad windowunmap 
    ;;
esac


