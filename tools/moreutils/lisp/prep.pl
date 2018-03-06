#!/usr/bin/perl
#
#
use strict;
use warnings;

my %langs = (
   guile => ''
);



my $lang = $ARGV[0];
my $fname = $ARGV[1];

die "usage: filenme" unless $fname;

open (my $fh , '<', $fname) or die "Err: couldnt open $fname";

my (@word, @out);
my $intxt;

sub pushout {
   push @out, join '', @word;
   undef @word;
}

my $prev;
while (<$fh>){
   my $leadws = 1;
   my $dropws ;
   foreach (split '', $_){
      if($intxt){
         if($_ eq '"'){
            pushout;
            undef $intxt;
         }else{
            push @word, $_
         }
      }else{
         if($_ eq ' '){
            unless($dropws){
               pushout if @word;
               push @out, $_;
            }
         }else{
            undef $dropws;
            if($_ eq '|'){
               $dropws = 1;
               unless ($leadws) {
                  push @out, ' ';
               }
            }elsif($_ eq '>'){
               if($prev eq '-'){
                  pop @word;
                  if($leadws){
                     push @word, '  ';
                  }
               }else{
                  push @word, $_;
               }
               pushout ();
               #}elsif($_ eq '('){
               #if(@word){
               #push @out, $_;
               #pushout;
               #push @out, ' ';
               #}else{
               #push @out, $_
               #}
            }else{
               push @word, $_
            }
            undef $leadws;
         }

      }

      $prev = $_;
   }
}

pushout if @word;

print( join('', @out));







