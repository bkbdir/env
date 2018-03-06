
set -gx PERL5LIB ""

set -l perllib $HOME/perl5/lib/perl5 $HOME/.perllib /etc/perl /usr/share/perl5 /usr/local/lib/site_perl /usr/local/lib/x86_64-linux-gnu/perl/5.22.1 /usr/local/share/perl/5.22.1 /usr/lib/x86_64-linux-gnu/perl5/5.22 /usr/lib/x86_64-linux-gnu/perl/5.22 /usr/share/perl/5.22 /usr/lib/x86_64-linux-gnu/perl-base

for plib in $perllib
   set -l lib $plib":"
   test -d $plib ; and set -gx PERL5LIB $lib$PERL5LIB
end
set -gx PERLLIB $PERL5LIB

