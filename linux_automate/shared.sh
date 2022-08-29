
cd `dirname $0`
SCRIPTDIR=`pwd`
cd -

cd $SCRIPTDIR
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

cd -
