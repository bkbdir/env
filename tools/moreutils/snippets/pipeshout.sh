#!/bin/sh


#  pipeshout
#  
# 
set -u
set -e

SHOUTS=${SHOUTS_HOME-$HOME/pipe/shouts}

die(){
	echo >&2 "$@"
	exit 1
}
usage(){
	die "Usage: $0 $USAGE"
}

[ -d "$SHOUTS" ] || die "Sorry: the base dir $SHOUTS doesnt exist."


filename=$(date "+%Y-%m-%d_%H-%M-%S").txt
ext=${filename#*.}
year=$(date "+%Y")

basedir=$SHOUTS/$year
path=$basedir/$filename

[ -f "$path" ] && { die " File name $filename already exist." }

message=
read -p " Message?  " -e message 

tags=
read -p " Tags?  " -e tags


[ -z "$message" ] && die "Sorry: No message given"
[ -z "$tags" ] && die "Sorry: No tags given"

    
curdate=$(date "+%Y-%m-%d")
{
    echo "$cmt $filename - $description $cmtend"
    echo "$cmt"
    echo "$cmt    Copyright (c) $year Ben, srctxt.org $cmtend"
    echo "$cmt    created: $curdate $cmtend"
    echo "$cmt    tags: ${basetag}, $tags             $cmtend"
    echo "$cmt"
    echo "$cmt    access: $accessmode                 $cmtend"
    echo ' '
    echo ' '
} > $path

vim $path +9
