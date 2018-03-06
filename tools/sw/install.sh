#!/bin/sh


# ~/.paths

paths=$HOME/.paths
[ -d "$paths" ] || {
	echo "Err: no paths direcotry "
	echo "run the install.sh in './shell'"
	exit 1 
}

rm -f $paths/sw
ln -s $(pwd) $paths/sw


# aux

aux=$HOME/aux

[ -d "$aux" ] && {

	rm -f $aux/.paths
	ln -s $paths $aux/.paths 

	rm -f $aux/sw
	ln -s $(pwd) $aux/sw

}


