DIR_ORIGIN=$PWD
DIR_SCRIPT="$(dirname $(realpath ${BASH_SOURCE}))"
cd $DIR_SCRIPT
cd ../

rm -r $PWD/production/volume/static/pages/browse
rm -r $PWD/production/volume/static/pages/chalange
rm -r $PWD/production/volume/static/pages/user
rm -r $PWD/production/volume/static/pages/new
rm -r $PWD/production/volume/static/pages/home

cp -r $PWD/dev/browse/build		$PWD/production/volume/static/pages/browse
cp -r $PWD/dev/chalange/build	$PWD/production/volume/static/pages/chalange
cp -r $PWD/dev/user/build		$PWD/production/volume/static/pages/user
cp -r $PWD/dev/new/build		$PWD/production/volume/static/pages/new
cp -r $PWD/dev/home/build		$PWD/production/volume/static/pages/home

mv $PWD/production/volume/static/pages/browse/index.html 	$PWD/production/volume/static/pages/browse/browse.html
mv $PWD/production/volume/static/pages/chalange/index.html 	$PWD/production/volume/static/pages/chalange/chalange.html
mv $PWD/production/volume/static/pages/user/index.html 		$PWD/production/volume/static/pages/user/user.html
mv $PWD/production/volume/static/pages/new/index.html 		$PWD/production/volume/static/pages/new/new.html
mv $PWD/production/volume/static/pages/home/index.html 		$PWD/production/volume/static/pages/home/home.html

cd $DIR_ORIGIN

