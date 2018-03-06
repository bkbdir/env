#!/bin/bash
#[[ -f ~/.Xresources ]] && xrdb -merge ~/.Xresources

# which layout? setxkbmap -query | grep layout
setxkbmap ch,us 
#
#exec bspwm
#
#exec herbstluftwm --locked
#
#
# set shell for sxhkd
export SXHKD_SHELL='/bin/sh'

if which sxhkd ; then
   sxhkd &
fi
