#!/bin/sh


url="$@"
os=$(uname)

case $os in 
	Darwin)
#		url="$(pbpaste)"
		;;
	*)
		echo "invalid choice, quitting ..."
		exit 1
		;; 
esac
	
[ -n "$url" ] || { echo "No url; exit" ; exit 1 ; }

sh $HOME/.exo/code/util/open-url-in-viewer.sh "$url"
