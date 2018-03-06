
dev=$HOME/dev
cwd=$(pwd)

devi=$dev/i

mkdir -p $dev

rm -rf $devi
mkdir -p $devi

rm -rf useritems
mkdir useritems
rm -f $dev/useritems
ln -s $cwd/useritems $dev/useritems

me=$(whoami)
host=$(hostname)
homedir=homedir_${me}_${host}
here=$(basename $cwd)

[ "$homedir" = "$here" ] || { echo "Err: this is not homedir root"; exit 1; }

rm -f $dev/homedir
ln -s $HOME/$homedir $dev/homedir

handle_trio_dirs () {
   local user="$1"
   local path="$2"
   local item="$3"

   for dir in "$path"/*; do
      [ -d "$dir" ] || continue
      bdir=$(basename $dir)

      left=${bdir%.*}
      right=${bdir##*.}

      case $bdir in
         *.*.*)
            user=${left%.*}
            middle=${left##*.}
            mkdir -p  $dev/$middle
            rm -f   $dev/$middle/$bdir
            ln -s $cwd/$dir $dev/$middle/$bdir
            mkdir -p  $devi/$middle
            rm -f   $devi/$middle/$bdir
            ln -s $cwd/$dir $devi/$middle/$bdir
            ;;
         *.*)
            rm -f $dev/$left.$user.$right
            ln -s $cwd/$dir $dev/$left.$user.$right
            rm -f $devi/$left.$user.$right
            ln -s $cwd/$dir $devi/$left.$user.$right
            ;;
            *)
            echo invalid $bdir
            ;;
      esac
   done
}

handle_trio () {
   local defaultuser="$1"
   local user="$2"
   local middle=$3
   local right="$4"
   local path="$5"
   local item="$6"

   case "$middle" in 
      *-*)
         label=${middle%_*}
         if [ "$defaultuser" = "$user" ] ; then
            
            echo rm -f $dev/$label.$right
            rm -f $dev/$label.$right
            ln -s $cwd/$path $dev/$label.$right
            rm -f $devi/$label.$right
            ln -s $cwd/$path $devi/$label.$right
         else
            rm -f $dev/$item
            ln -s $cwd/$path $dev/$item
            rm -f $devi/$item
            ln -s $cwd/$path $devi/$item
         fi
         ;;
      *)
         handle_trio_dirs "$user" "$path" "$item"

         ;;
   esac
}

handle_duo () {
   local user="$1"
   local left=$2
   local right="$3"
   local path="$4"

   case "$left" in 
      *-*)
         label=${left%%_*}
         rm -f $dev/$label.$right
         ln -s $cwd/$path $dev/$label.$right
         rm -f $devi/$label.$right
         ln -s $cwd/$path $devi/$label.$right
         ;;
      *)
         echo "Todo(handle_duo): $left"
         exit 1
         ;;
   esac

}

handle_useritem () {
   local defaultuser="$1"
   local dir=$2
   local item="$3"
   local path="$4"

   local left=${item%.*}
   local right=${item##*.}

   case "$item" in 
      *.*.*)
         middle=${left##*.}
         local user=${left%.*}
#         handle_item "$u" "$item"
         handle_trio "$defaultuser" "$user" "$middle" "$right" "$path" "$item"
         ;;
      *.*)
         handle_duo "$defaultuser" "$left" "$right" "$path"
         ;;
      *)
         continue
         ;;
   esac
}


for i in *; do
   [ -d "$i" ] || continue
   bi=$(basename $i)
   case "$i" in
      userboxes_*|usernodes_*)
         item_user=${i%_*}
         user=${item_user##*_}
         for ii in "$i"/*; do
            [ -d "$ii" ] || continue
            bii=$(basename $ii)
            rm -f useritems/$bii
            ln -s $cwd/$ii useritems/$bii

            handle_useritem "$user" "$bi" "$bii" "$ii"
        done 
         ;;
      *)
         echo nn
         ;;
   esac

done
