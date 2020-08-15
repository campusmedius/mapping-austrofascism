for png in `(find ./* -name "*.png")`
do
  xml=`echo $png | sed "s/png$/png.aux.xml/"`
  echo "--- $png"
  pngquant --force --quality=50-80 --strip --skip-if-larger --output $png $png
  rm $xml
done
