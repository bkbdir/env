#!/bin/sh

script=$1

colon="$HOME/.utils/Colon.pm"

[ -f "$script" ] || { echo "Err: no script $script; " ; exit 0 ; }
[ -f "$colon" ] || { echo "Err: no colon script $colon; " ; exit 0 ; }


sn=$(basename $script)
sname=${sn%.*}
app=$HOME/.utils/bin/$sname

{
    echo '#!/usr/bin/perl';
    echo ""
    cat $script $colon ;
} > $app

chmod 0755 $app 
cat $app



