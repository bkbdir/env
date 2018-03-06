#!/usr/bin/perl

#
use strict;
use warnings;
package Templator;


my $templs = "$ENV{HOME}/.utils/data/templator";


my $get_templs; $get_templs = sub {
    my $tmpl = shift;

    return unless $tmpl;

    if(-f $tmpl ) {
        return $tmpl
    }elsif( -d $tmpl){

        my $res =  ::sentaku("ls $tmpl") ;
        return $get_templs->("$tmpl/$res")
    }else{
        die "Err: must be dir or file"
    }
};

print $get_templs->($templs);

#unless (-f "$ENV{HOME}/.utilities/rc/templatorrc" ){ die "no envrc"};

#system("bash $ENV{HOME}/.utilities/vendor/sentaku.sh");
#
#
1;

