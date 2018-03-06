#!/bin/sh


edidir=$HOME/.var/edi

[ -d $edidir ] || mkdir -p $edidir


file=$1

[ "$file" = "" ] && exit

ext="${file##*.}"

echo $et
case $ext in
    html)
        pandoc -f html -t markdown -s $1 > $edidir/markdownout.md
        vim  --servername READER --remote-tab  /home/ben/.var/edi/markdownout.md
        ;;
    md)
        vim  --servername READER --remote-tab  $file
        ;;
    *)
        exit
        ;;
esac


tmux select-pane -t edit:0.1



