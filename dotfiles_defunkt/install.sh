#!/bin/sh

boxname=$(hostname)

cwd=$(pwd)

this=$(basename $cwd)

rootdir=$(dirname $(dirname $(dirname $(dirname $cwd))))
if [ ! "$rootdir" = "$HOME/_roots" ] ; then
	if [ ! "$rootdir" = "$HOME/_userdir" ] ; then
      echo "Err: no valid root folder under $rootdir"
      exit 1
   fi
fi

aux=$HOME/aux
[ -d "$aux" ] || mkdir -p $aux 


# link .config to aux
if [ -d "$HOME/.config" ] ; then
   rm -f $aux/.config
   ln -s $HOME/.config $aux/.config
fi

# link this directory to ~/aux/ 
rm -f $aux/$this
ln -s $cwd $aux/$this

# link ~/roots to ~/aux/
rootname=$(basename $rootdir)

rm -f $aux/roots
ln -s $rootdir $aux/roots


# linking stuff from devdata
hname=$(hostname)
devdata=$rootdir/devdata_${USER}_${hname}
# [ -e "$devdata" ] || { echo "Err: no devdata under $devdata"; exit 1; }
for dir in $devdata/*; do # secrets, boxes, auxrepos, repos, ...
   [ -d "$dir" ] || continue
   bdir=$(basename $dir)
   bdirn=${bdir%.*}
   rm -f $aux/$bdir
   rm -f $aux/$bdirn
   ln -s $dir $aux/$bdir
done


# Links to ~/aux
for item in cheatsheet.txt shell  configs  ; do
   [ -e "$item" ] && {
    rm -f $aux/$item
    ln -s $cwd/$item $aux/$item
   }
done

# home Links to ~/aux
for item in Downloads local opt ; do
	hitem=$HOME/$item
   [ -e "$hitem" ] && {
    rm -f $aux/$item
    ln -s $hitem $aux/$item
   }
done

# dotfiles
for df in $HOME/.*; do 
   bdf=$(basename $df)
   [ "$bdf" = '.'  ] && continue
   [ "$bdf" = '..'  ] && continue
   [ -e "$df" ] || continue
   [ -L "$df" ] || continue
   rm -f $aux/$bdf
   ln -s $df $aux/$bdf
done

