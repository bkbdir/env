#!/bin/bash


# create an index with subtitles:
# ------------------------------
#
# 2017
#    my article
#    other article
#
# 2018
#    my article
#    other article
#

cwd=$(pwd)

titlelong=$(basename $cwd)
title="${titlelong#*-}"
year="${titlelong%-*}"


echo "<html><title>$title $year</title><body>"

echo "<h1>$title $year</h1>"


echo "<dl>"

for  d in *; do
   [ -d "$d" ] || continue
   echo "<dt><a href='$d/index.html'>$d</a></dt>"
   for  txt in article.txt article.md readme.txt Readme.txt README.txt readme.md Readme.md README.md ; do
      if [ -f "$d/$txt" ] ; then
         desc="$(head -1 $d/$txt | cut -c 3-)" # markdown titles: # My Title
         echo "<dd>$desc</dd>"
         echo "<dt><br> </dt>"
         break
      fi
   done
   echo "<dd> </dd>"
done

echo "</dl>"

echo '</body></html>'
