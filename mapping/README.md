# Mapping



## Freytag & Berndt 1933 - Basemap



### Create a tif with a sRGB color profile

```sh
convert Stadtplan_Wien_1933_highres.tif -profile sRGB\ Profile.icc Stadtplan_Wien_1933_highres_srgb.tif
```



### Georeference with QGIS

For rectifying the map we use QGIS.

http://www.qgistutorials.com/de/docs/3/advanced_georeferencing.html

After all points are set use `Generate GDAL Script` to export the commands and run it in the commandline. For resampling we use `lanczos` for the tranformation `Thin Plate Spline`

```sh
gdal_translate -of GTiff -gcp 18409.7 18224.4 1.82313e+06 6.14068e+06 -gcp 17773.5 17155.2 1.82259e+06 6.14165e+06 -gcp 17331.5 18210.8 1.82218e+06 6.14066e+06 -gcp 14466 19543.1 1.81959e+06 6.13936e+06 -gcp 9942.71 21473.1 1.81544e+06 6.13748e+06 -gcp 9987.87 22445.2 1.81548e+06 6.13656e+06 -gcp 16411.9 16812.6 1.82129e+06 6.14193e+06 -gcp 18576.2 16554 1.82329e+06 6.14221e+06 -gcp 18081.7 16187.1 1.82285e+06 6.14259e+06 -gcp 17177.3 13307 1.82198e+06 6.14529e+06 -gcp 21359.2 14451.8 1.82585e+06 6.14422e+06 -gcp 30869.9 15547 1.83491e+06 6.1432e+06 -gcp 38705.1 18164 1.84241e+06 6.14065e+06 -gcp 25391.9 27811.3 1.82965e+06 6.13165e+06 -gcp 30262.4 29292.5 1.83432e+06 6.13019e+06 -gcp 5208.25 27261.5 1.81104e+06 6.13194e+06 -gcp 6618.93 17116.3 1.81226e+06 6.1416e+06 -gcp 8532.02 6129.42 1.81379e+06 6.15196e+06 -gcp 10659 19453.3 1.81609e+06 6.13938e+06 -gcp 17324.2 10890.7 1.82203e+06 6.14765e+06 -gcp 22730.8 9370.08 1.8272e+06 6.14909e+06 -gcp 13844.4 15038.6 1.81896e+06 6.14362e+06 -gcp 16984.3 9621.16 1.82177e+06 6.14884e+06 -gcp 16726.7 9923.02 1.82158e+06 6.1486e+06 -gcp 16833.9 10263.2 1.82163e+06 6.1483e+06 -gcp 16718.5 10678.3 1.8215e+06 6.14782e+06 -gcp 16749.1 10513.5 1.82152e+06 6.14797e+06 -gcp 16654.7 10494.3 1.82146e+06 6.14799e+06 -gcp 16669.7 10203.6 1.82151e+06 6.14835e+06 -gcp 16860.9 9595.97 1.82167e+06 6.14886e+06 -gcp 16969.1 9296.1 1.82176e+06 6.14915e+06 -gcp 17050.1 9309.44 1.82186e+06 6.14913e+06 -gcp 17060.1 9156.99 1.82186e+06 6.1493e+06 -gcp 18230 18383.8 1.82297e+06 6.14052e+06 -gcp 18299.1 18285.1 1.82303e+06 6.14062e+06 -gcp 18385.9 18349.2 1.82311e+06 6.14056e+06 -gcp 18321.8 18446.9 1.82305e+06 6.14047e+06 -gcp 18019.8 18362.1 1.82277e+06 6.14051e+06 -gcp 18446.6 18167.8 1.82316e+06 6.14072e+06 -gcp 18145.1 18179.7 1.8229e+06 6.14071e+06 -gcp 17595.9 17765.7 1.82242e+06 6.14108e+06 -gcp 17753 17684.4 1.82256e+06 6.14116e+06 -gcp 17997.2 17925.3 1.82276e+06 6.14093e+06 -gcp 17758.1 18098.3 1.82255e+06 6.14077e+06 -gcp 15809 20087.7 1.82079e+06 6.13887e+06 -gcp 15297.8 20039.3 1.82034e+06 6.13893e+06 -gcp 15501.9 20391.8 1.82051e+06 6.13859e+06 -gcp 15650 20455.1 1.82067e+06 6.1385e+06 -gcp 15494.8 20149.8 1.8205e+06 6.13884e+06 -gcp 15119 20388.3 1.82017e+06 6.13858e+06 -gcp 10395.2 21279.5 1.81587e+06 6.13766e+06 -gcp 10712.3 21145.1 1.81616e+06 6.13779e+06 -gcp 10240.7 20987.1 1.81573e+06 6.13795e+06 -gcp 10902.9 20010 1.81631e+06 6.13888e+06 -gcp 10509.2 20988.4 1.81597e+06 6.13794e+06 -gcp 10648.8 21730.5 1.81608e+06 6.13724e+06 -gcp 10190.7 21894.1 1.81567e+06 6.13709e+06 -gcp 11207.3 21440.8 1.81661e+06 6.13751e+06 -gcp 9562.91 21018.5 1.81507e+06 6.13791e+06 -gcp 9300.45 21723.2 1.81483e+06 6.13724e+06 -gcp 11342.1 22914.1 1.81677e+06 6.1361e+06 "/home/akrim/projects/campusmedius/mapping/Freytag & berndt 1933/Stadtplan_Wien_1933_highres_srgb.tif" "/tmp/Stadtplan_Wien_1933_highres_srgb.tif"

gdalwarp -r lanczos -tps -co COMPRESS=LZW -dstalpha -t_srs EPSG:3857 "/tmp/Stadtplan_Wien_1933_highres_srgb.tif" "/home/akrim/projects/campusmedius/mapping/Freytag & berndt 1933/Stadtplan_Wien_1933_highres_srgb_modified.tif"
```

### Create map tiles

Map tiles are created in `backend/tiles`. To create the tiles run:

```sh
python ./gdal2tiles.py --tilesize=512 -z 9-18 -r lanczos --processes=8 ../../mapping/Freytag\ \&\ berndt\ 1933/Stadtplan_Wien_1933_highres_srgb_modified.tif ./
```

To reduce the size we optimze the PNGs with `pngquant`, therfore run the script `optimze-png.sh`.

```sh
for png in `(find ./* -name "*.png")`
do
  xml=`echo $png | sed "s/png$/png.aux.xml/"`
  echo "--- $png"
  pngquant --force --quality=50-80 --strip --skip-if-larger --output $png $png
  rm $xml
done
```

To deploy the tiles we create a tar.

```sh
tar -zcf tiles.tar.gz ./empty.png ./9 ./10 ./11 ./12 ./13 ./14 ./15 ./16 ./17
```



## Eckebrecht Kepler 1658

The Eckebrecht Kepler map is directly used as image, see `campusmedius/frontend/campusmedius/src/assets/eckebrecht.jpg`



## Buildings

The polygons for the 3D buildings are downloaded from https://www.wien.gv.at/stadtentwicklung/stadtvermessung/geodaten/bkm/ with the [Geodaten Viewer](https://www.wien.gv.at/ma41datenviewer/public/start.aspx).

The Downloadformat is citygml. For the rendering in the campusmedius application specific buildings are extracted for the 5 mediators of the mediation governed transmissions. A list of the coresponding buildings ids is in `Buildings/objects.txt`. To use the buildings in mapboxgljs the following steps are requiered:

- Load all citygml data into [3dcitydb](https://www.3dcitydb.org/3dcitydb/)
- Export citygml for specific bounding box
- Convert citygml to cityjson with [citygml-tools](https://github.com/citygml4j/citygml-tools)
- Import cityjson into [Blender](https://github.com/cityjson/Up3date)
- Remove all unwanted buildings
- Export as cityjson
- Convert cityjson to citygml with citygml-tools
- Edit citygml xml file with text editor to have only one building
- Import single building citygml file into 3dcitydb
- Export as collada file (dae)
- Convert from collad to glb [online](https://www.creators3d.com/online-viewer)
- Use longitude, latitude and heading from collada kml file to load glb file with three.js in [mapboxgljs](https://docs.mapbox.com/mapbox-gl-js/example/add-3d-model/)