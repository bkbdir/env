#!/bin/sh


# ~/.paths

paths=$HOME/.hostpaths

[ -d "$paths" ] || {
	echo "Err: no paths direcotry "
	echo "run the install.sh in './shell'"
	exit 1 
}

rm -f $paths/utils
ln -s $(pwd) $paths/utils


# aux

aux=$HOME/aux

[ -d "$aux" ] && {

	rm -f $aux/.hostpaths
	ln -s $paths $aux/.hostpaths 

	rm -f $aux/utils
	ln -s $(pwd) $aux/utils

}


