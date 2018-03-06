#!/bin/sh


sshdir=$HOME/.ssh

[ -e "$sshdir" ] || { echo "Err: no  sshdir under $sshdir" ; exit 1; }

for k in  $sshdir/*.pub; do
   bk=$(basename $k)
   bkname="${bk%.pub}"
   echo 'kkk ' . $bkname
done
