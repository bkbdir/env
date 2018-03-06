#!/bin/bash


#sess=$1
#win=$2
#pane=$3
#cmd=$4

edisess='edishell'
ediwin=$(tmux display-message -t $edisess -p '#W')
edipane=$(tmux display-message -t $edisess:$ediwin -p '#P')

ctx=$(cat "/proc/$(xdotool getwindowpid "$(xdotool getwindowfocus)")/comm")

hide  () {
    case $ctx in
        urxvtd)
            xdotool search --onlyvisible --classname URxvtPrompt windowunmap \
            || xdotool search --classname URxvtPrompt windowmap 
        ;;
        *)
            tmux display-message "Err: urxvtd not running"
        ;;
    esac
}

movefrom_edit(){
        tmux select-pane -D
}

move_h(){
    dir=$1
    #mode=$(tmux list-windows -t edishell)
    #ediwin=$(tmux display-message -t edishell -p '#W')
    #edipane=$(tmux display-message -t edishell -p '#P')
    #tmux select-pane -t edishell:$newediwin.+
    case $edipane in
        0)
            tmux select-pane -t edishell:$ediwin.2
            ;;
        1)
            tmux select-pane -t edishell:$ediwin.0
            ;;
        2)
            tmux select-pane -t edishell:$ediwin.0
            ;;
        *)
            tmux select-pane -t edishell:$ediwin.0
            #exit 1
            ;;
    esac
}

   
#read -n 1 input
#dispatch $input

goto_horizontal(){
    dir=$1
    tmux select-pane -t edishell -${dir}
}

goto_vertical (){
    dir=$1
    edipane=$(tmux display-message -t $edisess:$ediwin -p '#P')
    currsess=$(tmux display-message -p '#S')
    case $currsess in
        *-out)
            tmux select-pane -t edishell -${dir}
            ;;
        *)
            tmux select-pane -${dir}
            ;;
    esac
}
resize_vertical (){
    dir=$1
    tmuxdir=$2
    edipane=$(tmux display-message -t 'edishell' -p '#P')
    case $edipane in
        0)
            tmux send-prefix -t edishell
            tmux send-keys -t edishell $tmuxdir 
            ;;
        *)
            tmux resize-pane -t edishell -${dir} 15 
            ;;
    esac
}

resize_horizontal (){
    dir=$1
    tmux resize-pane -t edishell -${dir}  10
}

while read -n1 -r -p "q|> " && [[ $REPLY != q ]]; do
    hide
    #sleep 0.1
  case $REPLY in
        h) goto_horizontal 'L' ;;
        l) goto_horizontal 'R' ;;
        a) goto_vertical 'D' ;;
        k) goto_vertical 'U' ;;
        H) resize_horizontal 'L' ;;
        L) resize_horizontal 'R' ;;
        A) resize_vertical 'D' 'a' ;;
        K) resize_vertical 'U' 'k' ;;
        *)
            echo "Err: unknown command $cmd in $edisess/$ediwin/$edipane"
    ;;
  esac
  echo ""
done
