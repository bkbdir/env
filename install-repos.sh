#!/bin/sh

aux=$HOME/aux
repos=$aux/repos

[ -d "$repos" ] || mkdir -p $repos

cd ../..
cwd=$(pwd)
echo cc $cwd
for d in *repos*; do
	based=$(basename $d)
	basen=${based%.*}
	basenn=${basen%.*}
	rm -f  $repos/$basenn
	ln -s $cwd/$d $repos/$basenn

done


cd -
