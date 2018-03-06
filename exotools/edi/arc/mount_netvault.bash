#!/bin/bash

cwd=$(pwd)

currdir=$(dirname $0)



mntdest=/media/netvault
mntfile=$currdir/netvault_a.tc

err () {
    echo "Err: " $1

    echo "press key to continue ..."
    read -n 1 key
    exit 1
}

[ -d "$mntdest" ] || err "please create mount point on $mntdest" 


#echo "Err: something wrong with mount destination $mntdest"  ; exit 1; }
    [ -f "$mntfile" ] || err "mntfile $mntfile not exist" 


    perl $currdir/netvault_v151001.pl


    if [ $? -eq 0 ]
    then
          echo  "Successfully retrieved tabula recta "
    else
            err "with secrethash.pl" 
    fi


    truecrypt --mount --password=$(xclip -sel clipboard -o )  $mntfile $mntdest 

#sh $currdir/linkfiles.sh

echo "Press key to proceed ..."
read -n 1
exit 0

