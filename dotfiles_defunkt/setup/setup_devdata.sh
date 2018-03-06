#!/bin/sh


cwd=$(pwd)
auxdir=$HOME/aux


roots=$HOME/_roots
if [ -d "$roots" ] ; then
   [ -d "$auxdir" ] || mkdir -p "$auxdir"
   for dir in  _roots local opt Downloads; do
      [ -d "$HOME/$dir" ] && {
         rm -f $auxdir/$dir
         ln -s $HOME/$dir $auxdir/$dir
      }
   done
else
   echo "Err: no _roots folder"
   exit 1
fi
 
devdatadir=$(basename $cwd)

case "$devdatadir" in
   devdata_*)
      continue
   ;;
*)
   echo "Not a devdata dir"
   exit 1
   ;;
esac



rm -f $auxdir/devdata
ln -s $cwd $auxdir/devdata

for dir in $cwd/*; do
   basedir=$(basename $dir)
   rm -f $auxdir/$basedir
   ln -s $dir $auxdir/$basedir
done


