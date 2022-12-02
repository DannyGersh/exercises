#!/bin/bash

# this script compiles latex to svg
# first arg - path to .tex file
# second arg - name of .tex file to compile without path or extension

cd "$1"

timeout 1m pdflatex \
	-interaction \
	batchmode \
	-parse-first-line \
	-no-shell-escape \
	-file-line-error \
	"$2.tex" && \
pdfcrop \
	"$2.pdf" \
	"$2.pdf" &&
dvisvgm \
	--pdf \
	"$2.pdf" &&
rm \
	"$2.aux" \
	"$2.log" \
	"$2.pdf" \
	"$2.tex" \
	*.log
