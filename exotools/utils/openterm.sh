#!/bin/sh

os=$(uname)

args="$@"

function iterm {
osascript - "$args" <<EOF
on run argv
tell application "iTerm"
    activate
	(create window with profile "ExoOpenterm" command argv)
end tell
end run
EOF
}

function back2last {
	osascript -e 'tell application "Keyboard Maestro Engine" to do script "activate-last"'
}

case "$os" in
	Darwin)
		# iterm 
      res=$(urxvtc -g 80x25+1500+200 -c "$HOME/.exo/code/reader.sh")
      back2last
		#urxvtc -g 80x25+1500+200 -e bash -c  "${args} ; ~/.exo/code/util/back_to_last.sh"
;;
	*)
		echo "not impl"
		;;
esac
