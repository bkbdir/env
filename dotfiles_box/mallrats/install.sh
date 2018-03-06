


cwd=$(pwd)
dev=$HOME/dv

homeconfig=$HOME/.config

[ -d $homeconfig ] || mkdir $homeconfig
[ -d $dev ] || mkdir $dev


for d in *; do
   case "$d" in
      config_*)
         dname=${d##*_}
         rm -f $homeconfig/$dname
         ln -s $cwd/$d $homeconfig/$dname
         ;;
   esac
done

rm -f $dev/.config
ln -s $homeconfig $dev/.config
