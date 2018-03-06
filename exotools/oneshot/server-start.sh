#!/bin/sh

[ -f "$HOME/.init.lsp" ] || { echo "Err: ~/.init.lsp is not here"; exit 1; }
[ -n "$EXO_PORT" ] || { EXO_PORT=3333 ;  }

newlisp server-boot.lsp -c -d $EXO_PORT  &
