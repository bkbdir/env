#!/bin/sh


cwd=$(pwd)
what=$(basename $cwd)

title=${what%-*}

echo '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
echo '<html xmlns="http://www.w3.org/1999/xhtml">'
echo '<head>'
echo '  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'
echo "  <title>$title</title>"
echo '  </head>'
echo '  <body>'
echo "  <h1>$title</h1>"

echo "  <dl>"


if [ -d "src" ] ; then
   echo "    <dt><a href='src'>src</a></dt>"
   echo "    <dd> </dd>"
fi

for d in *; do
   case "$d" in 
      src)
         continue
         ;;
      *)
      [ -d "$d" ] || continue
      echo "    <dt><a href='$d'>$d</a></dt>"
      echo "    <dd> </dd>"
      ;;
   esac
done

echo "  </dl>"


echo '  </body>'
echo '  </html>'
