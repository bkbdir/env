#!/bin/sh


target=~/.exo/tmp/worg-search


rm -f $target

/usr/local/bin/ranger --choosefiles=$target ~/worg


if [ -f "$target" ] ; then
	targetpath=$(cat $target)
	/usr/local/bin/gvim  --remote-silent $targetpath
else
	echo noting
fi
