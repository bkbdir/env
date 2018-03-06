#!/bin/sh


mkdir -p ~/.gnupg

chmod 0700 ~/.gnupg

os=$(uname)

[ -n "$os" ] || { echo "Err: no valid os " ; exit 1; }


for f in $os/* ; do
   [ -f "$f" ] || continue
   base=$(basename $f)
   rm -f ~/.gnupg/$base
   cp $f ~/.gnupg/
done


chmod 0600 ~/.gnupg/*
