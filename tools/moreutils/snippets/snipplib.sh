snipplib_setpastedir () {
    basedir=${1-}
    access=${2-}
    fileinput=${3-}

    [ -z "$basedir" ] && echo ( "Sorry: no basedir"; exit 1; }
    [ -z "$access" ] && echo ( "Sorry: no accesscode"; exit 1; }
    

    else
        acc=
        read -p " Access [o]rg or  [c]om?  " -e acc
        case "$acc" in 
            o) accessmode=$PUBLIC; pastedir=$PASTEBASE/$PUBLICPDIR;;
            c) accessmode=$PRIVATE; pastedir=$PASTEBASE/$PRIVATEPDIR;;
            *) die "Sorry: No valid access code given"
        esac
    fi

# optional file input
    fileinput=${2-}
    fileoutput=
    if [ -n "$fileinput" ] ; then
        [ -f "$fileinput" ] || die "Sorry: No valid fileinput given"
        fileoutput=$fileinput
    fi

    if [ -z "$fileoutput" ] ; then
        read -p " Filename?  " -e fileoutput
    fi

    s.getpath "$pastedir" $accessmode $fileoutput
}

snipplib_getpath () {
    basedir=${1-}
    accessmode=${2-}
    filename=${3-}

    for arg in basedir accessmode filename ; do
        val=$(eval echo $`echo $arg`)
        [ -z "$val" ] && { echo "Sorry: arg $arg is empty" 1>&2 ; exit 1 ; }
    done

    year=$(date "+%Y")
    basep="$basedir"/"$accessmode"/"$year"
    [ -d "$basep" ] || { 
        mkdir -p "$basep" || { 
            echo  "Sorry: Couldn't create basedir $basep." 1>&2; 
            exit 1; 
        }
    }
    p=${basep}/${filename}
    echo "$p"

}

snipplib_header () {
    author=${1-}
    lang=${2-}
    access=${3-}
    tags=${4-}
    desc=${5-}

    for arg in author lang access tags desc ; do
        val=$(eval echo $`echo $arg`)
        [ -z "$val" ] && { echo "Sorry: arg $arg is empty" 1>&2 ; exit 1 ; }
    done
    cmt=
    cmtend=
    case "$lang" in
        shell) cmt='# '; cmtend='';;
        perl) cmt='# '; cmtend='';;
        python) cmt='# '; cmtend='';;
        ocaml) cmt='(* '; cmtend=' *)';;
        text) cmt=''; cmtend='';;
        *) echo "Sorry: language $lang unknown" 1>&2; exit 1;;
    esac

    year=$(date "+%Y")
    cdate=$(date "+%Y-%m-%d")
    echo "${cmt}${desc}${cmtend}" 
    echo ''
    echo "$cmt    Copyright (c) $year $author    $cmtend"
    echo "$cmt    created: $cdate   $cmtend"
    echo "$cmt    tags: $tags      $cmtend"
}
