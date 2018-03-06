#!/bin/bash



token=$1

printpw=$2

dev=$HOME/dev

err () {
    echo "Err: $1"

    echo "Press key to continue ..."
    read -n 1 inp
    exit 1
}

script="$dev/secutils/passwords_Adminsv151001.1.pl"

[ -f $script ] || err "script $script not accessible"



echo "Twik Master please"
read  -s master
echo thanks

if [ -n "$token" ]; then 
    echo "Password for $token"
else
    echo "Token please"
    read token
fi

if [ -n "$printpw" ] ; then
    echo 'token ' . $token
    shift
    shift
    perl $dev/secutils/passwords_Adminsv151001.1.pl "$token" 'Admins.A_special25v151001.1' "$master" 
    echo "Press key to continue ..."
    read -n 1 inp
else
    perl $dev/secutils/passwords_Adminsv151001.1.pl "$token" 'Admins.A_special25v151001.1' "$master" | xsel -b 

    echo "Press key to continue ..."
    read -n 1 inp
fi


