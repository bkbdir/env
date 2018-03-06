#!/bin/sh

# compile output from ferret repl. Ferret is an implementation of Clojure in c++ for small devices.

file=$1

name=${file%.*}

cljfile=$name.clj
cppfile=$name.cpp

print_succ=0
print_err=0

tmpfile=$(mktemp)

while true
do
   if [ -f "$file" ]; then
      [ "$cljfile" -ot "$cppfile" ] && {
         g++ -std=c++11 -pthread $cppfile > $tmpfile 2>&1
         if [ "$?" = 0 ] ; then
            if [ "$print_succ" -eq 0 ] ; then
               clear
               ./a.out
            fi
            print_succ=1
            print_err=0
         else
            if [ "$print_err" -eq 0 ] ; then
               clear
               cat $tmpfile
            fi
            print_succ=0
            print_err=1
         fi
      } 
   else
     echo "Err no file $file"
    exit 1
   fi
	sleep 0.1
done
