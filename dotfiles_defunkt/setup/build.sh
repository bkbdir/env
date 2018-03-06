#!/bin/sh

alias md2html='pandoc -s'

[ -d ../build/files ] || mkdir -p ../build/files
[ -d ../build/archive ] || mkdir -p ../build/archive


pkg=$(basename $(pwd))

stamp=$(date '+%Y-%m-%d')
dir=${pkg}_${stamp}
tar=$dir.tar.gz


tar_latest=$pkg-latest.tar.gz


rm -rf $dir
rm -rf htmlsrc
rm -rf htmldoc
rm -f $tar
rm -f $tar_latest

mkdir htmlsrc

for f in $(find . -type f); do
    case $f in
        *.git*)
            continue
            ;;
        *)
            dirr=$(dirname $f)
            fnn=$(basename $f)
            outdir=
            if [ "$dirr" = '.' ];then
                outdir=htmlsrc
            else
               outdir=htmlsrc/$dirr
           fi
           mkdir -p $outdir
pygmentize -f html -O full,style=emacs,linenos=1  -l $(pygmentize -N $f) -o   $outdir/$fnn.htm $f

#$ pygmentize -f html -O full,style=emacs -o test.html test.py
                
    esac
done

mkdir $dir 
for f in * ; do
    [ "$f" = "$dir" ] && continue
    [ "$f" = "sources" ] && continue
    cp -r $f $dir/
done


ln -s $tar $tar_latest

tar cfvz $tar $dir

if [ -d doc ] ; then 
    mkdir htmldoc 
    for f in doc/* ; do
        [ -f $f ] || continue
        bn=$(basename $f)
        bnn=${bn%.*}
        md2html $f > htmldoc/$bnn.html
    done
fi

for f in *.tar.gz; do
    [ -f "$f" ] || continue
    case $f in
        *-latest.tar.gz)
            rm -f ../build/files/$f
            mv $f ../build/files/
            ;;
        *)
            bnx=$(basename $f)
            i=0
            if [ -f ../build/files/${bnx} ] ; then
                while [ -f ../build/archive/${bnx}_old${i} ] ; do  
                    i=$(expr 1 + $i)
                done
                mv ../build/files/$bnx ../build/archive/${bnx}_old${i}
            fi
            mv $f ../build/files/
            ;;
    esac
done

rm -rf $dir
rm -rf ../build/htmlsrc
mv htmlsrc ../build/htmlsrc


rm -rf ../build/html
[ -d htmldoc ] && mv htmldoc  ../build/htmldoc

rm -f ../build/index.html
md2html README.txt > ../build/index.html

