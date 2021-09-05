#!/usr/bin/env bash

cd $(dirname "$0")

OUT_FILE='js13k-2021-space.zip'
MAX_SIZE=13312

if [ -d 'build' ]; then
	rm -r 'build'
fi

mkdir -p 'build/dangers'
mkdir -p 'build/levels'

cp 'dev/index-dev.html' 'build/'
# cp 'dev/'*.gif 'build/'
cp 'dev/js/'*.js 'build/'
cp 'dev/js/dangers/'*.js 'build/dangers/'
cp 'dev/js/levels/'*.js 'build/levels/'

cd 'build' > '/dev/null'

# Remove line-breaks from HTML file.
tr -d '\n' < 'index-dev.html' > 'index.html'

# Remove the single JS files and only include the minified one.
sed -i'' 's/js\/js13k\.js/i.js/' 'index.html'
sed -E -i'' 's/<script src="([a-zA-Z0-9_-]+\/)+[a-zA-Z0-9_.-]{2,}\.js"><\/script>//g' 'index.html'

# Minify and combine the JS files.
terser \
	'js13k.js' \
	'Assets.js' \
	'Audio.js' \
	'Input.js' \
	'Level.js' \
	'LevelObject.js' \
	'Player.js' \
	'Renderer.js' \
	'dangers/DangerEye.js' \
	'dangers/SmallBite.js' \
	'levels/Intro.js' \
	'levels/Eyes.js' \
	'levels/Teeth.js' \
	'levels/Outro.js' \
	--ecma 10 --warn \
	--compress --toplevel \
	--mangle reserved=['js13k'] \
	-o 'i.js'

sed -i'' 's/^"use strict";//' 'i.js'

rm 'index-dev.html'
rm -rf 'dangers' 'levels'
find -type f -name '*.js' -not -name 'i.js' -delete

JS_SIZE=$( stat --printf="%s" 'i.js' )
HTML_SIZE=$( stat --printf="%s" 'index.html' )
UNZIPPED_SIZE=$(( $JS_SIZE + $HTML_SIZE ))

# ZIP up everything needed.
# 9: highest compression level
zip -9 -q -r "$OUT_FILE" ./*

BEFORE_ADVZIP_SIZE=$( stat --printf="%s" "$OUT_FILE" )

# Improve compression with ECT:
# https://github.com/fhanau/Efficient-Compression-Tool
# ECT_BIN="$HOME/programming/Efficient-Compression-Tool/build/ect"
# $ECT_BIN -9 -q -strip -zip "$OUT_FILE"

# Further optimize the compression.
# advzip can be installed from the "advancecomp" package.
# 4: best compression
# i: additional iterations
advzip -q -z -4 -i 200 "$OUT_FILE"

# Test integrity of file.
# STDOUT(1) is just the file name.
# STDERR(2) shows actual errors, if there are some.
advzip -t -p "$OUT_FILE" 1> /dev/null

CURRENT_SIZE=$( stat --printf="%s" "$OUT_FILE" )
FREE_SPACE=$(( $MAX_SIZE - $CURRENT_SIZE ))
printf '\n'
printf '  Max size:                   %5d bytes\n' "$MAX_SIZE"
printf '  ---------------------------------------\n'
printf '  - File sizes (unzipped):    %5d bytes\n' "$UNZIPPED_SIZE"
printf '  - ZIP size (before advzip): %5d bytes\n' "$BEFORE_ADVZIP_SIZE"
printf '  - ZIP size (after advzip):  %5d bytes\n' "$CURRENT_SIZE"
printf '  ---------------------------------------\n'
printf '  Space left:                 %5d bytes\n' "$FREE_SPACE"
printf '\n'
