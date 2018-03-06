function chomp () {
   echo "$1" | perl -pe 'chomp'
}

function die () {
   echo "Err: "$1
   exit 1
}

function shasum_base64 () {
   echo -n "$1"  | shasum  | xxd -r -p  | base64
}
function checksum () {
   echo -n "$1"  | shasum  | xxd -r -p  | base64
}


function clipboard () {
   printf "$1" | xclip -sel clip
}

die() {

copy () {
    echo $1 | xclip -sel clip 
}
copycat () {
    wat=$1
    if [ -e $wat ] ;then
        xclip -sel clip < $@ 
    else
        echo "Err: path not exist"
    fi
}

# Sync the environment of an existing shell
# http://superuser.com/questions/479796/is-it-possible-to-spawn-an-ssh-agent-for-a-new-tmux-session
#
#  tmux already updates the environment according to
#  the update-environment settings in the config. However
#  for existing shells you need to sync from from tmux's view
#  of the world.
tmux_sync_env () {
        external_env=`tmux showenv | grep -v "^-"`
            export ${external_env}
}
psgrep(){
    local name=$1
    ps aux | perl -n -e " /$name/i && !/grep $name/ &&  print"
}


repl() {
    list=$@;
    string="${(j: :)list}"
    tmux send-keys -t main:0.0 $string Enter
}


