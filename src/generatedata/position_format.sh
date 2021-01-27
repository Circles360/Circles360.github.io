#!/bin/sh

output=""

# Formats the console output positions
while read -r line
do
    new_line=`echo $line | sed 's/[^{]*//' | sed 's/,$//'`
    output="${output}\n${new_line},"
done < "../flowchart/maps/$1/position.json"

echo "[\n" > "../flowchart/maps/$1/position.json"
echo "$output" | sed '$ s/,$//' >> ../flowchart/maps/$1/position.json
echo "\n]" >> "../flowchart/maps/$1/position.json"