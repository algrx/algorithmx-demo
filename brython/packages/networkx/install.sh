# delete non-python files
find $1 -type f ! -name '*.py' -delete

# delete tests
find $1 -type d -name 'tests' -exec rm -rf {} +

# delete unnecessary
rm -rf $1/testing
rm -rf $1/drawing
rm -rf $1/readwrite
rm -rf $1/linalg
find $1/generators -type f ! -name 'random_graphs.py' ! -name 'degree_seq.py' ! -name 'classic.py' -delete
rm -rf $1/algorithms

base_dir=$PWD
script_dir=`dirname $0`

# python fixes
cd $script_dir
python install.py $1
cd $base_dir

# patches
cp -a $script_dir/patch/. $1
