script_dir=`dirname $0`

# delete tests
find $1 -type d -name 'tests' -exec rm -rf {} +

# delete unnecessary
rm -rf $1/main.py
rm -rf $1/server
rm -rf $1/jupyter
rm -rf $1/nbextension
rm -rf $1/labextension

# patches
cp -a $script_dir/patch/. $1
