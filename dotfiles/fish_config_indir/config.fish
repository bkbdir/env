#" fish_vi_modl
#
set FUNCTIONS $HOME/.config/fish/functions

if [ -d $FUNCTIONS ] 
   echo source $FUNCTIONS/my_fish_vi_key_bindings.fish
   set -g fish_key_bindings my_fish_vi_key_bindings
end

set -gx GPG_TTY (tty)

set -g SHELL fish
set -gx GUITERM 'lxterminal'

# do I have to run ???
# exec ssh-agent fish 
#

# PATH
set -gx PATH 
set -l sysbins /bin /sbin /usr/bin /usr/sbin /usr/local/bin /usr/local/sbin 

set -l homebins $HOME/local/bin $HOME/.local/bin $HOME/opt/bin $HOME/.bin $HOME/.pub-cache/bin

for bin in $sysbins $homebins
   test -d $bin ; and set -gx PATH $bin $PATH
end

# GLOBALS
set -g -x VISUAL vim
set -g -x EDITOR vim
set -g -x PAGER less
set -g -x DOCHOME ~/docs


set config_fish $HOME/.config/fish/conf 
if [ -d $config_fish ] 
   for f in $config_fish/*.fish
      if [ -f $f ] 
         source $f
      end
   end
end

