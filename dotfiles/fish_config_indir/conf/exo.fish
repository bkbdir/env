set -gx EXO_HOME $HOME/.exo

set -gx EXO_TOOLS $HOME/.exo/tools

set exobin $EXO_TOOLS/bin
test -d $exobin ; and set -gx PATH $exobin $PATH

set -g EXO_PORT 3333

