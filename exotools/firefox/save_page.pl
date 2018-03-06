#!/usr/bin/env perl


$page_file = $ARGV[0];
$url_orig = $ARGV[1];
$title_orig = $ARGV[2];


$title = $title_orig;
$title =~ s/[^A-Za-z0-9]+/_/g;

$url = $url_orig;
$url =~ s/[^A-Za-z0-9]+/_/g;




print $url;
