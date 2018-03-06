#!/bin/bash

pw_script=secutils/twik_password.bash

[ -f "$pw_script" ] || { echo "Err: no pw script $pw_script!" ; exit 1 ; }

echo "Twik Master please"
read  -s master
echo thanks

echo "Twik PIN please"
read  -s pin
echo "" 

token='*fritzthecat: #den'
profile='ben.A_special24-v151001.1'

password=$(bash $pw_script "$profile" "$token" "$master" "$pin")


cwd=$(pwd)

date=$(date "+%y-%m-%d")
self=$(basename $cwd)


tarfile=${self}_$date.tar.gz
tarfile_latest=${self}_latest.tar.gz

cd ..

rm -f $tarfile
rm -f $tarfile_latest

tar cfvz $tarfile $cwd
cp $tarfile $tarfile_latest


curl --ftp-ssl -k -T $tarfile "ftp://ben:$password@ftp.auxdir.com/ben/public/tars/env_pub/"
curl --ftp-ssl -k -T $tarfile_latest "ftp://ben:$password@ftp.auxdir.com/ben/public/tars/env_pub/"

rm -f $tarfile

cd -
