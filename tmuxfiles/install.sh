

os=$(uname)
cwd=$(pwd)

rm -f $HOME/.tmux.conf

rm -f $HOME/.tmux-common.conf
ln -s $cwd/tmux-common.conf ~/.tmux-common.conf

case "$os" in
   Darwin)
      ln -s $cwd/tmux-mac.conf $HOME/.tmux.conf
      rm -f $
      ;;
   *)
         die 'todo'
    ;; esac



