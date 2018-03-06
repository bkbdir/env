#!/bin/sh


cwd=$(pwd)

redir=$HOME/redir

[ -d "$redir" ] || mkdir "$redir" 

rm -f $redir/env
ln -s $cwd $redir/env



#link to redir
for d in  cheatsheet.txt exotools; do
	[ -e "$d" ] || continue
	rm -f $redir/$d
	ln -s $cwd/$d $redir/$d
done

# TOOLS: link to redir and ~/
tools=$HOME/tools
mkdir -p $tools
rm -f $redir/tools
ln -s $tools $redir/tools

for t in tools/*; do
   [ -e "$t" ] || continue
   bt=$(basename $t)
   rm -f $tools/$bt
   ln -s $cwd/$t $tools/

   rm -f $redir/$bt
   ln -s $cwd/$t $redir/$bt
done

# exotools
exohome=$HOME/.exo
mkdir -p $exohome/log
rm -f $exohome/tools
ln -s $cwd/exotools $exohome/tools



rm -f $redir/.exo
ln -s $exohome $redir/.exo
rm -f $redir/exotools
ln -s $cwd/exotools $redir/

# link from ~/ to redir/
for d in Downloads local share ; do
   [ -d "$HOME/$d" ] || continue
   rm -f $redir/$d
   ln -s $HOME/$d $redir/$d
done

rm -f $redir/boot.sh
ln -s $cwd/boot.sh $redir/

cd dotfiles && sh ./install.sh
cd $cwd

cd vimfiles && sh ./install.sh
cd $cwd

share=$HOME/share
mkdir -p $HOME/share
rm -f $redir/share
ln -s $HOME/share $redir/share
mkdir -p $redir/aux
for d in aux-*-site; do
   [ -d "$d" ] || continue
   nm=${d#*-}
   rm -f $redir/aux/$nm
   ln -s $cwd/$d $redir/aux/$nm

   lang=${nm%-*}
   mkdir -p $share/$lang
   rm -f $share/$lang/site
   ln -s $cwd/$d $share/$lang/site
   rm -f $redir/$nm
   ln -s $cwd/$d $redir/$nm
done
