#!/bin/bash


if pgrep -x "urxvtd" ; then
    echo "urxvtd is already running"
else
    echo "starting urxvt -q -o -f"
    urxvtd -q -o -f
fi

echo "Press key ..."
read y

