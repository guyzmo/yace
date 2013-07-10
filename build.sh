#!/bin/sh

npm install
cd node_modules/twitter-bootstrap
npm install
make bootstrap
cd -
cd node_modules/jsrepl
cake bake
cd -

for f in \
        ./node_modules/jsPDF/jspdf.js \
        ./node_modules/jsPDF/libs/FileSaver.js/FileSaver.js \
        ./node_modules/jsPDF/libs/Blob.js/Blob.js \
        ./node_modules/jsPDF/libs/Blob.js/BlobBuilder.js \
        ./node_modules/jsPDF/libs/Deflate/deflate.js \
        ./node_modules/jsPDF/libs/Deflate/adler32cs.js \
        ./node_modules/jsPDF/jspdf.plugin.addimage.js \
        ./node_modules/jsPDF/jspdf.plugin.from_html.js \
        ./node_modules/jsPDF/jspdf.plugin.ie_below_9_shim.js \
        ./node_modules/jsPDF/jspdf.plugin.sillysvgrenderer.js \
        ./node_modules/jsPDF/jspdf.plugin.split_text_to_size.js \
        ./node_modules/jsPDF/jspdf.plugin.standard_fonts_metrics.js; do
    cat $f ; echo ";"; 
done >! static/jspdf.js

