DIR_ORIGIN=$PWD
DIR_SCRIPT="$(dirname $(realpath ${BASH_SOURCE}))"
cd $DIR_SCRIPT
cd ../

DIR_BASE=$PWD

cd $DIR_BASE/dev/browse
npm run build &
cd $DIR_BASE/dev/chalange
npm run build &
cd $DIR_BASE/dev/new
npm run build &
cd $DIR_BASE/dev/user
npm run build &
cd $DIR_BASE/dev/home
npm run build &

cd $DIR_ORIGIN
