#!/bin/sh

realp=$(perl -MCwd -le 'print Cwd::realpath($ARGV[0])' $1)

[ -f "$realp" ] || { echo "Err: no valid fil" ; exit 1; }

if [ -f "$realp" ] ; then
   fname=$(basename $realp)
   dname=$(dirname $realp)
   name=${fname%.*}
   ext=${fname##*.}
   case "$ext" in
      html)
         echo hhh
         ;;
      *)
         echo oo
         ;;
   esac


 #  tmux send-keys -t out "clear; cat $rp" Enter
else
   cmd=$1
   file=$2
   shift
   shift
   if [ -f "$file" ] ; then
      rp=$($rpx $1)
      tmux send-keys -t out "clear; ${cmd} $rp/$file" Enter
   else
      tmux send-keys -t out "clear; ${cmd} ${file} $@" Enter
   fi
fi

