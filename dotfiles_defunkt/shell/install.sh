#!/bin/sh

cwd=$(pwd)
aux=$HOME/aux

[ -d $aux ] || mkdir $aux
rm -f $aux/shell
ln -s $cwd $aux/shell


[ -d "$HOME/.config" ] || mkdir $HOME/.config
rm -f $aux/.config
ln -s $HOME/.config $aux/.config

for d in *; do
	bd=$(basename $d)
	name=${bd%-*}
	case "$d" in
		*-rc)
			for f in  $cwd/$d/*; do
				bf=$(basename $f)
				rm -f $HOME/.$bf
				ln -s $f $HOME/.$bf

				rm -f $aux/.$bf
				ln -s $f $aux/.$bf
				rm -f $aux/$d
				ln -s $cwd/$d $aux/$d
			done
			;;
		*-config)
			[ -d $HOME/.config/$d ] || mkdir -p $HOME/.config/$d
			for f in  $cwd/$d/*; do
				bf=$(basename $f)
				rm -f $HOME/.config/$name/$bf
				ln -s $f $HOME/.config/$name/$bf
			done

			rm -f $aux/$d
			ln -s $cwd/$d $aux/$d
			;;
		*-indir)
			[ -d $HOME/.$name ] || mkdir -p $HOME/.$name
			for f in  $cwd/$d/*; do
				bf=$(basename $f)
				rm -f $HOME/.$name/$bf
				ln -s $f $HOME/.$name/$bf
			done

			rm -f $aux/.$name
			ln -s  $HOME/.$name $aux/.$name
			rm -f $aux/$d
			ln -s $cwd/$d $aux/$d
			;;
		*-dir)
			rm -f ~/.$name
			ln -s $cwd/$d ~/.$name

			rm -f $aux/.$name
			ln -s $cwd/$d $aux/.$name

			rm -f $aux/$d
			ln -s $cwd/$d $aux/$d
			;;
		*-host)
			base=${name%-*}
			linkname=host$base

			hn=$(hostname)
			[ -d "$d/$hn" ] && {
				rm -f ~/.$linkname
				ln -s $cwd/$d/$hn ~/.$linkname

				rm -f ~/aux/.$linkname
				ln -s $cwd/$d/$hn ~/aux/.$linkname
				rm -f $aux/$d
				ln -s $cwd/$d $aux/$d
			}

			;;
		*)
			continue
			;;
	esac
done



