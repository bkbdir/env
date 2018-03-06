

sub _wc {
   my ($arg,$string) = @_;
   if($arg eq '-c'){
      my $n = split '', $string;
      return $n;
   }else{
      die "todo"
   }
}

my %iocmds = (
   print => sub { return $@ },
   wc => \&_wc,
);

sub io {
   my @res;
   foreach my $ln (@_){
      my $type = ref $ln;
      if ($type eq 'ARRAY'){
         my ($op, @args) = @$ln;
         @res = $iocmds{$op}->(@args, @res);
      }else{
         @res = $ln;
      }
   }
   return @res;
}

my @gg = io( "hello world" => [ qw(wc -c) ]);

print @gg;

