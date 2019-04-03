# delete tests
find $1 -name 'tests' -exec rm -rf {} \; &> /dev/null

# delete unnecessary
rm -rf $1/main.py
rm -rf $1/server
rm -rf $1/jupyter
rm -rf $1/nbextension
rm -rf $1/labextension

base_dir=$PWD
script_dir=`dirname $0`

# python fixes
cd $script_dir
python install.py $1
cd $base_dir

# patches
cp -a `dirname $0`/patch/. $1
