#!/bin/sh

cwd=$(pwd)


redir=$HOME/redir
[ -d "$redir" ] || mkdir -p "$redir" 

trash=$HOME/trash
[ -d "$trash" ] || mkdir $trash
rm -f $redir/trash 
ln -s $trash $redir/trash


linkfiles (){
   local dir=$1

   for f in $dir/*; do
      bf=$(basename $f)
      if [ -d "$f" ];  then


      case $bf in
      *_files) 
         for ff in $f/*; do
            [ -e "$ff" ] || continue
            bff=$(basename $ff)
                     [ -z $bff ] && continue
            t="$trash"/$(date +"%Y%m%d%M%S")
            [ -d "$t" ] || mkdir -p  $t
            [ -e "$HOME/.$bff" ] && { mv $HOME/.$bff $t/ ; }
            rm -f $HOME/.$bff
            ln -s 	$ff $HOME/.$bff
            rm -f $redir/.$bff
            ln -s 	$ff $redir/.$bff
         done
      ;;
      *_dir) 
         name=${bf%_*}
         rm -rf $HOME/.$name
           ln -s $f $HOME/.$name
         rm -f $redir/.$name
           ln -s $f $redir/.$name
      ;;
      *_config_indir)  # non destructive sub folders under ~/.config
         mname=${bf%_*}
         name=${mname%_*}

         homeconfig=$HOME/.config/$name

         [ -d "$homeconfig" ] || mkdir -p "$homeconfig"

         for ff in $f/*; do
               bff=$(basename $ff)
               [ -e "$ff" ] || continue
               rm -rf  $homeconfig/$bff
               ln -s 	$ff $homeconfig/$bff
           done

         redirconfig=$redir/$bf

         rm -f $redirconfig
         ln -s $f $redirconfig 
         ;;
      *_indir)  # non destructive sub folders
         name=${bf%_*}
         homedir=$HOME/.$name
         redirdir=$redir/.$name
         [ -d "$homedir" ] || mkdir $homedir 

         [ -d "$redirdir" ] || mkdir $redirdir 

           for ff in $f/*; do
               bff=$(basename $ff)
               [ -e "$ff" ] || continue
               rm -rf  $homedir/$bff
              ln -s 	$ff $homedir/$bff
               rm -rf  $redirdir/$bff
              ln -s 	$ff $redirdir/$bff

           done
      ;;
      *_config)  # destructive sub folders under ~/.config
         name=${bf%_*}

         [ -d "$HOME/.config" ] || mkdir -p $HOME/.config

         homedir=$HOME/.config/$name

           rm -rf $homedir
           ln -s $f $homedir

           rm -f $redir/.$name
           ln -s $f $redir/.$name

           rm -f $redir/$bf
           ln -s $f $redir/$bf

      ;;
      *)
         echo "Warn: omit directory '$f'"
      ;;
      esac
   else
           [ "$bf" = 'install.sh' ] && continue
           [ "$bf" = 'README.txt' ] && continue


            rm -f $HOME/.$bf
            ln -s $f $HOME/.$bf

         rm -f $redir/.$bf
         ln -s $f $redir/.$bf
   fi
   done
}

linkfiles $cwd 

os=$(uname)
if [ -d "$os" ] ; then
   linkfiles "$cwd/$os"
fi


if [ -d $HOME/.config ] ; then
   rm -f $redir/.config
   ln -s $HOME/.config $redir
fi
