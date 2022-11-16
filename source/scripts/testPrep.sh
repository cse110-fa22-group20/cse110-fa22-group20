#!/bin/bash


# Assume you're running this from the scripts directory. 
# cd into scripts before running this if you're starting somewhere else.
cd ../js
# Save files to a temporary folder in case you mess up while making changes to this script.
mkdir unaltered
cp main.js unaltered/
cp db.js unaltered/

cat main.js | sed -z 's/false/true/' > temp
mv temp main.js

# number of lines that take up the export block at the bottom of db.js
EXPORT_LINES=12

cat db.js | head -n -"$EXPORT_LINES" | sed -z 's/false/true/' > temp
mv temp db.js