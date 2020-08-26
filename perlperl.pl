#!/usr/bin/perl -w

`curl --silent curl --silent "https://www.handbook.unsw.edu.au" > tmp.txt`;

my $header_text = `cat tmp.txt | grep -A 2 "a-browse-tile-header"`;
$header_text =~ s/--/\n/g;
my @headers = $header_text =~ /<h3 class="h4">[A-Z]{4}:\s(.*)<\/h3>/g;
#foreach (@headers) {
#    print $_."\n";
#}

my $link_text = `cat tmp.txt | grep "a-browse-tile m-right-0"`;
my @links = $link_text =~ /href="(\/.*)">/g;
#foreach (@links) {
#    print $_."\n";
#}

my %hash;
$i = 0;
$length = @links;
while ($i < $length) {
    $hash{$headers[$i]} = $links[$i];
    $i++;
}

foreach my $course (keys %hash) {
    print "Name: $course\n";
    print "Link: $hash{$course}\n\n";
}

`rm tmp.txt`;
