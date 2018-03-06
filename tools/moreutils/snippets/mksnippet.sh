#!/bin/sh


#  mkpaste.sh - 
#  
# 
set -u
set -e

die(){
	echo >&2 "$@"
	exit 1
}
usage(){
	die "Usage: $0 $USAGE"
}

access=${1-}
accessmode=
PASTEDIR=$HOME/push
if [ -n "$access" ] ; then
    case "$access" in 
        org) accessmode='public'; PASTEDIR=$PASTEDIR/openpastes;;
        com) accessmode='private'; PASTEDIR=$PASTEDIR/pastes;;
        *) die "Sorry: No valid access code given";;
    esac
else
    acc=
    read -p " Access [o]rg or  [c]om?  " -e acc
    case "$acc" in 
        o) accessmode='public'; PASTEDIR=$PASTEDIR/openpastes;;
        c) accessmode='private'; PASTEDIR=$PASTEDIR/pastes;;
        *) die "Sorry: No valid access code given"
    esac
fi

[ -d "$PASTEDIR" ] || die "Sorry: the base dir $PASTEDIR doesnt exist."
# optional file input

fileinput=${2-}
fileoutput=
if [ -n "$fileinput" ] ; then
    [ -f "$fileinput" ] || die "Sorry: No valid fileinput given"
    fileoutput=$fileinput
fi

if [ -z "$fileoutput" ] ; then
    read -p " Filename?  " -e fileoutput
fi


ext=${fileoutput#*.}
year=$(date "+%Y")

basedir=$PASTEDIR/$year
path=$basedir/$fileoutput

[ -d "$basedir" ] || mkdir -p "$basedir"
[ -f "$path" ] && {
echo " File name $fileoutput already exist, please give new one."
while read fileoutput; do
    path=$basedir/$fileoutput
    if [ -z "$fileoutput" ] ; then
        echo " not valid , please try again"
    elif [ -f "$path" ] ; then
        echo " Still a duplicate, please try again"
        path=$basedir/$fileoutput
    else
        break
    fi
    done
}

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
