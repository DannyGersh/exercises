
cd `dirname $0`
SCRIPTDIR=`pwd`
cd ../
SCRIPTDIR=$PWD

cd $SCRIPTDIR/dev/browse
npm run build &
cd $SCRIPTDIR/dev/chalange
npm run build &
cd $SCRIPTDIR/dev/new
npm run build &
cd $SCRIPTDIR/dev/user
npm run build &
cd $SCRIPTDIR/dev/home
npm run build &

cd -
