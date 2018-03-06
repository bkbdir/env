#!/bin/sh

key=$(for k in ~/.ssh/*.pub; do bk=$(basename $k); kn=${bk%.*}; echo $kn; done | ~/local/bin/fzf)

bash $HOME/dev/ediutils/password_ben.bash "$key" 


