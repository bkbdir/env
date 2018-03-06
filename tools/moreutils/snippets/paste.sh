#!/bin/sh


#  mkpaste.sh - 
#  
# 
set -u
set -e

. `shal` 'posix'

shal 'stdlib:x' "usage die"
shal 'snipplib:s' "getpath header"

alias usage='x.usage'
alias die='x.die'

PASTEBASE=$HOME/push



setpastedir 

exit 1

#snipath=$(s.getpath "$PASTEDIR" $accessmode $fileoutput)


ext=${fileoutput#*.}


description=
read -p " Description?  " -e description

tags=
read -p " Tags?  " -e tags


[ -z "$description" ] && die "Sorry: No description given"
[ -z "$tags" ] && die "Sorry: No tags given"

cmt=
cmtend=
basetag=
case "$ext" in 
    sh) cmt='#'; cmtend=; basetag='shell';;
    pl) cmt='#'; cmtend=;  basetag='perl' ;;
    ml) cmt='(*'; cmtend='*)';  basetag='ocaml' ;;
    *) cmt='//';;
esac
    
curdate=$(date "+%Y-%m-%d")
{
    echo "$cmt $fileoutput - $description $cmtend"
    echo "$cmt"
    echo "$cmt    Copyright (c) $year Ben, srctxt.org $cmtend"
    echo "$cmt    created: $curdate $cmtend"
    echo "$cmt    tags: ${basetag}, $tags             $cmtend"
    echo "$cmt"
    echo "$cmt    access: $accessmode                 $cmtend"
    echo ' '
    echo "$cmt --------------------------------------------- $cmtend"
    echo ' '
    [ -n "$fileinput" ] && cat "$fileinput"
} > $path

vim $path +9
