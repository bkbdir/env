Perl extensions for `rxvt-unicode`.

Note that the following convention is not intended to be literal, but to
indicate that the module in question should be appended to the existing line.

    URxvt.perl-ext-common: ...,module

To install these scripts, copy or link to `/usr/lib/urxvt/perl`.

fullscreen
----------
Toggle fullscreen for terminal

    URxvt.perl-ext-common: ...,fullscreen
    URxvt.keysym.F11: perl:fullscreen:switch

Dependency: wmctrl

newterm
-------
Open a new terminal in your current working directory, *a la* Ctrl-Shift-N in
`gnome-terminal`

    URxvt.perl-ext-common: ...,newterm
    URxvt.keysym.C-S-N: perl:newterm
