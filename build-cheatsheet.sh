#!/bin/sh

dev=$HOME/dev
env=$HOME/dev/env
cheats=$env/cheats

[ -d "$cheats" ] || { echo "Err: couldn't acces the cheats directory under $cheats." ; exit 1 ;  }

date=$(date +"%Y-%m-%d")
{
   echo "Cheatsheet"
   echo "=========="
   echo ""
   echo "(this file is generated ($date), pls do not edit)"
   echo ""
   echo "Table of Contents:"
   echo ""
   for f in $cheats/*; do
      [ -f "$f" ] || continue
      bf=$(basename $f)
      name=${bf%.*}
      echo  '- ' $name
   done
   echo ""
   echo "-------------"
   echo ""
} > "$env/cheatsheet.txt"

for f in $cheats/*; do
   [ -f "$f" ] || continue
   {
      cat $f 
      echo "" 
   } >> $env/cheatsheet.txt
done

