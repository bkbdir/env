#!/bin/sh

# bash.sh - A simple bash template

# Copyright (C) 2017 ben@auxdir.com 
# Licensed under The MIT License. See License-mit.txt

USAGE=

die () { echo $*; exit 1; }
usage () { local app=(basename $0); die "usage: $app $USAGE"; }
	
