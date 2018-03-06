alias chrome "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
alias rm  "rm -f"
alias passtab-bkb_1U0a 'passtab-profile bkb_1U0a'
alias hap hashapass
alias pw-seven-bkb 'pw "ben_H3-0c-ii" "seven;bkb;###"'
alias pw-seven-root 'pw "admin_H3-0c-ii" "seven;root+ssh;###"'
alias pw-ronin-admin 'pw "admin_H3-0c-ii" "ronin;admin"'
alias pw-fritz-admin 'pw "admin_H3-0c-ii" "fritz;admin"'
alias pw-topgun-admin 'pw "admin_H3-0c-ii" "topgun;admin"'
alias pw-topgun-jakobshare 'pw "jakob_H3-0c" "topgun;jakobshare;##"'

alias . "ls ."
alias fm "urxvtc -e /usr/local/bin/vifm"

alias love "/Applications/love.app/Contents/MacOS/love"

alias xreload "xrdb ~/.Xresources"
alias cdd "cd ~/dev/"
alias cdi "cd ~/dev/i"
alias cdr "cd ~/dev/repos"

alias today 'date "+%F"'
alias now 'date "+%F %T"'

alias sf "showfile"

alias u untar

alias ssh-restart "sudo service ssh restart"
alias sshr ssh-restart

alias apts "apt-cache search"
alias apti "sudo apt-get install"
alias aptu "sudo apt-get update"

alias chmox "chmod 0755"

#alias copy "xclip -sel clip"
#alias paste "xclip -sel clip -o"


#alias ack "ack-grep"

alias upl "/home/ben/local/perl/upl/upl -I /home/ben/local/perl/upl/lib"

alias l "ls -Fhtlr"
alias sl "ls"


alias worg "mvim --remote-silent"

alias lizpop "python -O -m lizpop.run"
alias lp "python -O -m lizpop.run"

# tmux
alias tmuxlist "tmux list-sessions"
alias txl tmuxlist
alias tmuxl tmuxlist

alias mp "mkdir -p "
alias mkdri "mkdir -p"

alias sshkeyless "ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no"
