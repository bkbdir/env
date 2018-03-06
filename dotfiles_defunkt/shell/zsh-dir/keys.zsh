bindkey "^a" beginning-of-line # ctrl-a
bindkey "^e" end-of-line # ctrl-e

#vi mode
#export KEYTIMEOUT=10
bindkey -v
bindkey -M viins ',,' vi-cmd-mode
# kill the escape lag
bindkey '^r' history-incremental-search-backward
