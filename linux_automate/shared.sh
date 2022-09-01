DIR_ORIGIN=$PWD
DIR_SCRIPT="$(dirname $(realpath ${BASH_SOURCE}))"
cd $DIR_SCRIPT
cd ../

rm -r $PWD/dev/browse/src/shared
rm -r $PWD/dev/chalange/src/shared
rm -r $PWD/dev/home/src/shared
rm -r $PWD/dev/new/src/shared
rm -r $PWD/dev/user/src/shared

cp -r $PWD/dev/shared $PWD/dev/browse/src/shared
cp -r $PWD/dev/shared $PWD/dev/chalange/src/shared
cp -r $PWD/dev/shared $PWD/dev/home/src/shared
cp -r $PWD/dev/shared $PWD/dev/new/src/shared
cp -r $PWD/dev/shared $PWD/dev/user/src/shared

cd $DIR_ORIGIN
