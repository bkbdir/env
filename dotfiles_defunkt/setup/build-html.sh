#!/bin/sh


outdir=$1

[ -z "$outdir" ] && { echo 'Usage: <outdir>' ; exit 1; }

[ -d "$outdir" ] && { echo "Err: outdir $outdir exists " ; exit 1; }
[ -f "$outdir" ] && { echo "Err: outdir $outdir exists " ; exit 1; }
[ -e "$outdir" ] && { echo "Err: outdir $outdir exists " ; exit 1; }


mkdir -p $outdir


find . -type f  | while read f; do
    dir=$(dirname $f)
    name=$(basename $f)
    echo $dir
    continue
    [ -d "$outdir/$dir" ] || mkdir -p $outdir/$dir
    { 
        echo "<html><head><title>$name</title></head><body><pre>"
        cat $f
        echo '</pre></body></html>'
    } > $outdir/$dir/$name.html
done

