#!/bin/sh

# echo "First argument is $1"
useful=`curl --silent "https://www.handbook.unsw.edu.au/undergraduate/specialisations/2020/SENGAH" | grep -A 4 'data-bucket="1"' | sed 's/--/&\n/g'`

echo $useful
