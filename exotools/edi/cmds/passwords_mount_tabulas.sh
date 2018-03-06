#!/bin/sh

tabulas=/media/sdc1/tabulas_mobile

[ -d $tabulas ] || { echo "Err: mobile tabulas not here"; exit 1; }

for t in $tabulas/*; do
    [ -f $t ] || continue
    bn=$(basename $t)

    rm -f $HOME/.$bn
    ln -s $t $HOME/.$bn

    rm -f $HOME/dev/.$bn
    ln -s $t $HOME/dev/.$bn

done

[ $? -eq 0 ] || { 
    echo "Error: you want proceed"
    read -n 1 ok
    exit 1
}
    


