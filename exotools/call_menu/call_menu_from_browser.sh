#!/bin/sh


url="$1"

[ -n "$url" ] || { echo "No url; exit" ; exit 1 ; }


os=$(uname)
case $os in 
	Darwin)
		osascript $HOME/.exo/code/menu/call_menu_from_browser.scpt "$url"
		;;
	*)
		echo "invalid choice, quitting ..."
		exit 1
		;; 
esac
	
