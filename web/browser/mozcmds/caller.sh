#!/bin/bash

tmp=$1
shift
cmd="$@"

eval "$cmd" > $tmp
