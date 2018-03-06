#!/bin/sh

# remote VIM


export NVIM_LISTEN_ADDRESS=/tmp/nvimsocket

if [ -e "$NVIM_LISTEN_ADDRESS" ] ; then
  nvr --remote $@
else
  nvr $@
fi


