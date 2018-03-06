#!/bin/dash


cwd=$(pwd)

script=$1



[ -f "$script" ] || { echo "Err: script $script no existo"; exit 1; }

echo "(define args '("'"'$cwd'" ' '"'$@'")) (load "'$cwd/$script'")' | netcat localhost 3333




