
top=$HOME/top

cwd=$(pwd)

mkdir -p $top

rm -f $top/userdir
ln -s $cwd $top/userdir

rm -rf items
mkdir -p items
rm -f $top/items
ln -s $cwd/items $top/items


handle_items () {
   local item_dir=$1
   local fuser=$2

   mkdir -p $top/$fuser

   local idn=$(basename $item_dir)

   local ext=${idn##*.}
   local main=${idn%.*}
   local name=${main##*.}


   for id in "$item_dir"/* ; do
      [ -d "$id" ] || continue
      bid=$(basename $id)
      case "$bid" in 
         *.*)
            local folder=${bid##*.}s
            local user=${bid%.*}
            mkdir -p $top/$folder
            mkdir -p $HOME/$folder

            local type=$(echo $idn | perl -pe 's/[\w\-]+\.(\w+)_\w+\.\w+/$1/g')
            [ -n "$type" ] || { echo "Err: couldnt detect type "; exit 1; }


            local item=$folder/$user.$type.$ext

            #rm -f $HOME/$item
            #ln -s $cwd/$id $HOME/$item

            rm -f $top/$item
            ln -s $cwd/$id $top/$item
            ;;
         *)
            rm -f $top/$domname/$bid
            ln -s $cwd/$id $top/$user/$bid
            ;;
      esac
   done
}

handle_dir () {
	local dir=$1
	local dirn=$(basename $dir)

	local ext=${dirn##*.}

	local main=${dirn%.*}
	local user=${main%.*}
	local domain=${main##*.}

	case "$domain" in 
		*-*_*)
			local domname=${domain%-*}
			local item=$domname.$user.$ext 
         local type=$(echo $dirn | perl -pe 's/[\w\-]+\.\w+\-(\w+)_\w+\.\w+/$1/g')
			case "$user" in
            aux*)
               case "$domname" in
                  repo|cloud)
                     mkdir -p $top/${domname}s
                     rm -f $top/${domname}s/$user.$type.$ext
                     ln -s $cwd/$dir $top/${domname}s/$user.$type.$ext
                  ;;
               sec)
                  rm -f $top/${ext}sec
                  ln -s $cwd/$dir $top/${ext}sec
                  ;;
                  *)
                     rm -f $top/$domname
                     ln -s $cwd/$dir $top/$domname
                  ;;
               esac
            ;;
            *)
				case "$domname" in
				user|cloud)
               mkdir -p $top/${domname}s
               #rm -f $top/${domname}s/$user.$type.$ext
               #ln -s $cwd/$dir $top/${domname}s/$user.$type.$ext
					;;
				*)
					rm -f $top/$item
					ln -s $cwd/$dir $top/$item
					;;
				esac
            ;;
      esac
			;;


			#rm -rf $top/user

			#mkdir $top/user
			#rm -f $top/user/$dirn
			#ln -s $dir $top/user/$dirn

		*)
			echo "Err: something wrong with $domain "
         exit 1
			;;
		esac
}

	         #[ "$dd" = "items" ] && continue
for d in *; do
	[ -e "$d" ] || continue
   #  echo 'd ' $d
	case "$d" in 
		user*)
			for dd in $d/*; do
				[ -d "$dd" ] || continue
            #echo 'ddd ' $dd
				bd=$(basename $dd)
				# ./items
            rm -f items/$bd
		      ln -s $cwd/$dd items/$bd

			   handle_dir $dd
			done

			;;
		*)
			continue
			;;
	esac
done

install_in_files () {
   local dir="$1"

   [ -d "$dir" ] || { 
      echo "Warn: sorry no dir $dir"
      return 
   }

   cd $dir
   [ -f "install.sh" ] && sh ./install.sh

   for d in *; do
      [ -d "$d" ] || continue
      case "$d" in
         *files)
            cd "$d"/
            [ -f "install.sh" ] && sh ./install.sh
            cd ..
            ;;
         *)
            continue
            ;;
      esac
   done
}

install_in_files $HOME/top/repos/aux-bkb.data.pub/env

install_in_files $HOME/top/repos/aux-bkb.data.net/privenv

