#!/bin/sh

output=""

# Formats the console output positions
while read -r line
do
    new_line=`echo $line | sed 's/[^{]*{/{/' | sed 's/,$//'`
    output="${output},\n${new_line}"
done < '../maps/EngineeringHonoursSoftware/position.json'

#echo $output

echo "[\n" > '../maps/EngineeringHonoursSoftware/position.json'
echo $output >> '../maps/EngineeringHonoursSoftware/position.json'
echo "\n]" >> '../maps/EngineeringHonoursSoftware/position.json'