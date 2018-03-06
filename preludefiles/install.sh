cwd=$(pwd)

for f in *; do
   [ -f "$f" ] || continue
   [ "$f" = "install.sh" ] && continue
   rm -f $HOME/.$f
   ln -s $cwd/$f $HOME/.$f
done

