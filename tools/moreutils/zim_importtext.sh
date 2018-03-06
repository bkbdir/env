#!/bin/sh

me=$(readlink $0)

inpath=$1

codelang=$2

[ -n "$codelang" ] || { codelang="plaintext" ;}

here=
if [ -n "$me" ] ; then
   here=$(dirname $me)
else
   here=$(dirname $0)
fi

filters=$here/zimfilter

[ -d "$filters" ] || { echo "Err: no filter dir in $filters"; exit 1; }

wikidir=$HOME/.wiki

importdir=$wikidir/import

[ -d "$wikidir" ] || { echo "err: wikdir $wikidir not extist" ; exit 1; }
[ -d "$importdir" ] || { mkdir -p $importdir; }


[ -f "$inpath" ] || { echo "usage: valid inpath"; exit 1; }

dir=$(dirname $inpath)

inbase=$(basename $inpath)

inname=${inbase%.*}
inext=${inbase##*.}

outpath=$importdir/$inname.txt

dat=$(date +'%Y-%m-%d')
titledate=$(date +'%A %d %B %Y')
#Monday 23 January 2017


preregex=$filters/$inext.pre
postregex=$filters/$inext.post
[ -f "$preregex" ] || { echo "Err: no prregex filter" ; exit 1; }


{
	echo "Content-Type: text/x-zim-wiki"
	echo "Wiki-Format: zim 0.4"
	echo "Creation-Date: ${dat}T00:00:00+01:00"

	echo " "
	echo "===== $inname ====="
	echo "Created $titledate" 


	echo " "
   if [ -f "$postregex" ] ; then
      perl -spl $preregex  -lang=$codelang $inpath  | pandoc -f html -t dokuwiki  |  perl $postregex "$codelang"
   else
      perl -spl $preregex  -lang=$codelang $inpath 
   fi
	
} > $outpath


