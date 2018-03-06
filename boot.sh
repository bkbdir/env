#!/bin/sh

# boot different stuff like: tmux, ssh keys into cache, 
twikpw=$HOME/dev/tools/moreutils/cipher/twikpw
[ -f "$twikpw" ] || { echo "Err: pw command in $twikpw not available"; exit 1; }

pwx=$HOME/tools/utils/pw
[ -f "$pwx" ] || { echo "Err: pw command in $pwx not available"; exit 1; }

hname=$(hostname)

pwuser='ben_H3-0c'

echo "Try to get password for 'gpg/laptops', maybe cancel the gpg-agent dialog"
${pwx} "${pwuser}-ii" 'gpg/laptops'
[ "$?" -eq 0 ] || { echo "Err: some error with $pwx, leaving"; exit 1; }

echo "Again:Try to get password for 'gpg/laptops', paste pw if necessary"
${pwx} "${pwuser}-ii" 'gpg/laptops'
[ "$?" -eq 0 ] || { echo "Err: some error with $pwx, leaving"; exit 1; }

echo "GPG password is in clipboard"




if which sxhkd ; then 
   if ! pgrep sxhkd ; then 
      export SXHKD_SHELL=/bin/sh; sxhkd & 
      echo "sxhdk started ... "
   fi
fi

if which urxvtd ; then
   if ! pgrep urxvtd ; then 
      urxvtd & 
      echo "urxvtd started ... "
   fi
fi

if which urxvtd ; then
   if ! pgrep tmux ; then 
      if ! tmux has-session -t $hname ; then
         ~/dev/tools/moreutils/getpw ben_H3-0c-ii "ssh/$hname"
         tmux new  -s $hname
      fi
   fi
fi

sshadd () {
   local key=$1
   echo ""
   echo "OK: Password in clipboard"
   ssh-add $key
   keychain --eval --quiet -Q $key
}

sshome=$HOME/.ssh
if [ -d "$sshome" ] ; then
   for s in $sshome/* ; do
      [ -f "$s" ] || continue
      bs=$(basename $s)
      bsf=${bs%.*}
      case "$bs" in 
         clouduser*.pub)
            echo Password: ${pwx} "${pwuser}-ii" "ssh/clouduser"
            ${pwx} "${pwuser}" "ssh/clouduser"
            sshadd $sshome/$bsf
            ;;
         *.pub)
            echo Password: ${pwx} "${pwuser}-ii" "ssh/$hname"
            ${pwx} "${pwuser}-ii" "ssh/$hname"
            echo ""
            echo "OK: Password in clipboard"
            sshadd $sshome/$bsf
            ;;
         *) continue ;;
      esac
   done
fi
