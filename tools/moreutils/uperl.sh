#!/bin/sh

script=$1
shift

/usr/bin/perl -I $HOME/.utils/lib -MDoubleColon $script $@ 
