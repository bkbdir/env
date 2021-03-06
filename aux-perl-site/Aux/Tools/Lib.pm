package Aux::Lib;

use strict;
use warnings;

our $VERSION = '0.01';


# the manual import is because of the one page scripts.
# with the squash tool we stuff the whole program in one page, no external modules
#
sub import_shell {
	no strict 'refs';
	use Aux::Lib::Shell;

	my ($caller) = caller;
	foreach (@_ ){
		my $name = $caller . '::' . $_;
		my $sym = 'Aux::Lib::Shell::' . $_;

		*{ $name } = \*{ $sym };
	}
}

1;

__END__

# Below is stub documentation for your module. You'd better edit it!

=head1 NAME

Aux::Lib - Perl extension for blah blah blah

=head1 SYNOPSIS

  use Aux::Lib;
  blah blah blah

=head1 DESCRIPTION

Stub documentation for Aux::Lib, created by h2xs. It looks like the
author of the extension was negligent enough to leave the stub
unedited.

Blah blah blah.

=head2 EXPORT

None by default.



=head1 SEE ALSO

Mention other useful documentation such as the documentation of
related modules or operating system documentation (such as man pages
in UNIX), or any relevant external documentation such as RFCs or
standards.

If you have a mailing list set up for your module, mention it here.

If you have a web site set up for your module, mention it here.

=head1 AUTHOR

ben, E<lt>ben@E<gt>

=head1 COPYRIGHT AND LICENSE

Copyright (C) 2016 by ben

This library is free software; you can redistribute it and/or modify
it under the same terms as Perl itself, either Perl version 5.22.1 or,
at your option, any later version of Perl 5 you may have available.


=cut
