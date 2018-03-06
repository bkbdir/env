lang=$1

outfile=$2

[ -n "$outfile" ] || { echo "usage: file" ; exit 1; }


name=${outfile%.*}
ext=${outfile##*.}

infile=$name.w

[ -f "$infile" ] || { echo "Err: couldn't file file $file" ; exit 1; }

perl prep.pl $lang $infile > $name.prep

#wisp $name.prep > $name.wisp

{ 
   [ -f "header/$lang.$ext" ] && cat "header/$lang.$ext"
   unsweeten $name.prep 
} | tee $outfile


