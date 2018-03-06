#!/bin/sh

cwd=$(pwd) 

sess=$(tmux display-message -p '#S')
win=$(tmux display-message -p '#I')
pane=$(tmux display-message -p '#P')

echo $sess $win $pane
basesess=${sess%-*}
outsess=${basesess}-out
tmux send-keys -t $outsess "sh virun.rc" C-m

exit

if [ -f virun ] ; then
    sh ./virun
else
    echo "Err: no virun file"
    exit 1
fi
#tmux send-keys -t out "sh ./virun.sh" C-m

exit

# END


case $pane in
    0)
        tmux send-keys -t "$sess:$win.1" "sh ./virun.sh" C-m
        ;;
    1)
        tmux send-keys -t "$sess:$win.0" "sh ./virun.sh" C-m
        ;;
    *)
        echo "Err: pane number invalid $pane"
        exit 1;
        ;;
esac

