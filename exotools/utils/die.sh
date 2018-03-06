#!/bin/sh


url="$1"

[ -n "$url" ] || { echo "No url; exit" ; exit 1 ; }




os=$(uname)
case $os in 
	Darwin)
		echo "$url" | pbcopy
		osascript -e 'tell application "Keyboard Maestro Engine" to do script "floflo"'
		;;
	*)
		echo "invalid choice, quitting ..."
		exit 1
		;; 
esac
	
