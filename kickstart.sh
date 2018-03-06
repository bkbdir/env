 

cwd=$(pwd)
here=$(basename $cwd)

today=$(date "+%F")
me=$(whoami)
host=$(hostname)

homedir=$HOME/homedir_${me}_${host}
[ -d "$homedir" ] || { echo "Err: no homedir under $homedir" ; exit 1; }
userboxes=$homedir/userboxes_${me}_${host}
[ -d "$userboxes" ] || { echo "Err: no userboxes dir  under $userboxes" ; exit 1; }
kickstart_store=$userboxes/kickstart-store_${host}.sec
[ -d "$kickstart_store" ] || { echo "Err: no kickstart-store under $kickstart_store" ; exit 1; }

kickdir=$kickstart_store/kickstart_${today}

mkdir -p $kickdir

case "$here" in
   *.*)
      heredom=${here%.*}
      heredom=${heredom##*.}
      herename=${heredom%-*}

      rm -rf $kickdir/$herename

      echo "Success:Copy $here to  $kickdir/$herename"
      cp -r $cwd $kickdir/$herename
      ;;
   *)
      rm -rf $kickdir/$here

      echo "Success:Copy $here to  $kickdir/$here"
      echo ""

      cp -r $cwd $kickdir/$here
      ;;
esac

