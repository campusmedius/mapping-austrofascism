for png in `(find ./* -name "*.png")`
do
  echo "--- $png"
  pngquant --force --quality=50-80 --strip --skip-if-larger --output $png $png
done
