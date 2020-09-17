#!/bin/sh

output=""

# Formats the console output positions
while read -r line
do
    new_line=`echo $line | sed 's/[^{]*{/{/' | sed 's/,$//'`
    output="${output},\n${new_line}"
done < "../maps/$1/position.json"

echo "[\n" > "../maps/$1/position.json"
echo $output >> "../maps/$1/position.json"
echo "\n]" >> "../maps/$1/position.json"