set -gx GOPATH $HOME/.gopath

set -x NEWLISPDIR /usr/local/share/newlisp-10.7.1/

set guilelibs /usr/local/Cellar/guile/2.2.2/share/guile/2.2/site
test -d $guilelibs ; and set -gx GUILE_LOAD_PATH $guilelibs

#set -l monobin /Library/Frameworks/Mono.framework/Versions/Current/bin/
set -l gobin $HOME/go/bin
set -l rustbin $HOME/.cargo/bin
set -l racketbin $HOME/.racket/6.9/bin/
set -l nodebin $HOME/local/node/node/bin
set -l nimbins $HOME/local/nim/git/Nim/bin $HOME/.nimble/bin
set -l cabalbins $HOME/.cabal/bin
set -l gambitbin /usr/local/Gambit/bin 
set -l dotnetbin /usr/local/share/dotnet/
set -l buildbin $HOME/builds/bin


set -l langbins $monobin $gobin $rustbin $racketbin $nodebin $nimbins $cabalbins $gambitbini $dotnetbin $buildbin


for bin in $langbins
   test -d $bin ; and set -gx PATH $bin $PATH
end

