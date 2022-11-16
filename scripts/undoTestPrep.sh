#!/bin/bash

# use this while testing testPrep.sh to restore files before changes.

cd ../js
mv unaltered/db.js ./db.js
mv unaltered/main.js ./main.js
rmdir unaltered