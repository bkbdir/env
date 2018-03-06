#!/bin/sh

wikidir=$HOME/.wiki

[ -d "$wikidir" ] || { echo "err: wikdir $wikidir not extist" ; exit 1; }

importdir=$wikidir/import

[ -d "$importdir" ] || mkdir -p $importdir

inpath=$1

[ -f "$inpath" ] || { echo "usage: valid inpath"; exit 1; }

dir=$(dirname $inpath)

inbase=$(basename $inpath)

inname=${inbase%.*}
inext=${inbase##*.}

outpath=$importdir/$inname.txt

[ -f "$outpath" ] && { echo "Err: outpug $outpath already exists" ; exit 1; }

dat=$(date +'%Y-%m-%d')
titledate=$(date +'%A %d %B %Y')
#Monday 23 January 2017


lang=
case $inext in
	*ml)
		lang='objective-caml'
		;;
	*)
		lang='text'
		;;
esac

{
	echo "Content-Type: text/x-zim-wiki"
	echo "Wiki-Format: zim 0.4"
	echo "Creation-Date: ${dat}T00:00:00+01:00"

	echo " "
	echo "====== $inname ======"
	echo "Created $titledate" 


	echo " "
	echo "{{{code: lang='$lang' linenumbers='True'"
	cat $inpath
	echo '}}}'

	
} > $outpath

