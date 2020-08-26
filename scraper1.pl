#!/usr/bin/perl -w

`curl --silent "https://www.handbook.unsw.edu.au/undergraduate/specialisations/2020/SENGAH" > tmp.txt`;

my $courses_text = `cat tmp.txt | grep -A 4 'data-bucket="1"'`;
$courses_text =~ s/--/\n/g;
my @courses = $courses_text =~ /aria-label="Course:\s*(.*)/g;
foreach (@courses) {
    $_ =~ s/\s//g;
    $_ = $_."\n";
}

print @courses;

my $titles_text = `cat tmp.txt | grep 'readmore__heading'`;
$titles_text =~ s/--/\n/g;
my @titles = $titles_text =~ /readmore__heading">(.*)<\/h4>/g;
foreach (@titles) {
    $_ = $_."\n";
}

print @titles;
`rm tmp.txt`

#my @matches = `echo $useful | grep -A 4 'data-bucket="1"'`;
#print @matches;
#$useful =~ s/--/\n/g;
#my @courses = $useful =~ /aria-label="Course:\s*(.*)/g;

#foreach (@courses) {
#    $_ =~ s/\s//g;
#    $_ = $_."\n";
#}

#print(@courses);
