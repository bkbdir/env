set -gx OPAMPATH $HOME/.opam/4.02.3
#set -gx OPAMPATH $HOME/.opam/4.02.3+buckle-master

set -gx CAML_LD_LIBRARY_PATH "$OPAMPATH/lib/stublibs"
export CAML_LD_LIBRARY_PATH

set -gx OPAMUTF8MSGS "1"
export OPAMUTF8MSGS

set -gx MANPATH "$OPAMPATH/man:/usr/share/man:/usr/local/share/man:/opt/X11/share/man:/usr/local/MacGPG2/share/man"
export MANPATH

set -gx BUCKLEHOME  /usr/local/lib/node_modules/bs-platform
#set -gx BSC_LIB "/home/ben/local/bucklescript/src/bucklescript/jscomp/stdlib/"
# SET PATH
for bin in $OPAMPATH/bin $BUCKLEHOME/bin
   test -d $bin ; and set -gx PATH $bin $PATH
end

export PATH

if  [ -d $OPAMPATH ]; 
   set -gx CAML_LD_LIBRARY_PATH "$OPAMPATH/lib/stublibs:/usr/lib/ocaml/stublibs"
   set -gx MANPATH "$OPAMPATH/man" $MANPATH
   set -gx OCAML_TOPLEVEL_PATH "$OPAMPATH/lib/toplevel"
else
   echo "could not set opam"
end

set OCAML_TOPLEVEL_PATH "$OCAMPATH/lib/toplevel"
export OCAML_TOPLEVEL_PATH

