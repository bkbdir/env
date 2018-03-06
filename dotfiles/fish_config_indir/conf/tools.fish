#" fish_vi_modl
#


set TOOLSDIR $HOME/tools

[ -f $TOOLSDIR/aliases.fish ] ; and source $TOOLSDIR/aliases.fish
[ -f $TOOLSDIR/functions.fish ] ; and source $TOOLSDIR/functions.fish

set -l toolbins $TOOLSDIR/utils $TOOLSDIR/moreutils/bin $TOOLSDIR/cmds $TOOLSDIR/symlinks $TOOLSDIR/sw/bin $TOOLSDIR/privutils perl-site/bin

for bin in $toolbins 
   test -d $bin ; and set -gx PATH $bin $PATH
end

