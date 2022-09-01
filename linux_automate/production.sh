DIR_ORIGIN=$PWD
DIR_SCRIPT="$(dirname $(realpath ${BASH_SOURCE}))"
cd $DIR_SCRIPT

python3 production.py

cd $DIR_ORIGIN
