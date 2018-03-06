#!/bin/sh


test=$(./hello.sh)

echo $test
osascript -e 'tell application "Keyboard Maestro Engine" to do script "activate_iterm"'
