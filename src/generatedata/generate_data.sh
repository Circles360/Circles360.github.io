#!/bin/sh

for file in `ls *Generator.mjs*`
do
    node $file
done
