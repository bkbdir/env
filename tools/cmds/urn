#!/bin/sh

urn=$HOME/local/urn/urn.git/bin/urn.lua

[ -f "$urn" ] || { echo "Err no urn file in $urn"; exit 1; }


luajit $urn $@
