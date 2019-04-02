# delete tests
find $1 -name 'tests' -exec rm -rf {} \; &> /dev/null

# delete unnecessary
rm -rf $1/main.py
rm -rf $1/server
rm -rf $1/jupyter
rm -rf $1/nbextension
rm -rf $1/labextension

# patches
cp -a `dirname $0`/patch/. $1
