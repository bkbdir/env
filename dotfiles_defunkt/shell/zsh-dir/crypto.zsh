
### START-Keychain ###
# Let  re-use ssh-agent and/or gpg-agent between logins
#
#PINENTRY_USER_DATA="USE_CURSES=1"

[ -f ~/bins/includes/ssh-find-agent.sh ] && {
    source ~/bins/includes/ssh-find-agent.sh
if ! test $SSH_AUTH_SOCK; then
    set_ssh_agent_socket
fi
}


GPG_TTY=`tty`
eval $(/usr/bin/keychain  --eval $HOME/.ssh/auxsend_rsa 8BB04488) 
#eval `keychain --eval --agents $HOME/.ssh/auxsend_rsa 8BB04488`
source $HOME/.keychain/$(hostname)-sh > /dev/null
source $HOME/.keychain/$(hostname)-sh-gpg > /dev/null
export GNUPGHOME=~/.gnupg
export GPGKEY=8BB04488



### End-Keychain ###
