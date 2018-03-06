
#$tag = $ARGV[0];
#
#print "Please give search tag \n";
#$tag = <>;
#chomp $tag;

$cwd = qx(pwd);

$path='"/Users/ben/Library/Application Support/Firefox/Profiles/hd1gqexl.default/places.sqlite"';

$sql = '"SELECT moz_bookmarks.title, moz_places.url  FROM moz_places  LEFT OUTER JOIN moz_bookmarks ON moz_places.id = moz_bookmarks.fk ;"';

#$cmd = "sqlite3 \"$path\" \"SELECT moz_bookmarks.title, moz_bookmarks.url FROM moz_places , moz_bookmarks where moz_places.id=moz_bookmarks.fk;\"";
    #
$cmd = "sqlite3 $path $sql";


$i  =  0 ;

@urlplaces;
@titleplaces;
foreach ( qx($cmd)){
	($title, $url) = split /\|/, $_;
	chomp $url;
	chomp $title;

	#my $handler = (($title =~ /^\s*$/) ?  $url :  $title ) ;

	if ($title ){
		$title =~ s/[^a-zA-Z0-9 _-]/ /g;
		$i++;
		push @urlplaces, [ $title, $url ];
		push @titleplaces, $i . ': '  . $title;
	}
}

die "Sorry no results " unless (@titleplaces > 0);

$txt = join "\n", @titleplaces;

$txt = $txt . "\n";
($result)=qx(echo "$txt" |  /usr/local/bin/fzf );

chomp $result;

die "Sorry, no result" unless $result;

$num;
if($result =~ /^(\d+)\:\s/){
	$num = $1;
}else{
	die "Err: couldn't retrieve number from result x"  . $result . 'x';
}

chomp $num;

die "Err: couldn't retrieve number from result" unless $num;

$urlresult =  $urlplaces[ $num - 1 ]->[1]  ;

die "Err: no url result " unless $url;


`ssh ben\@thewindow "/cygdrive/c/cygwin/bin/cygstart.exe  microsoft-edge:$urlresult"`
