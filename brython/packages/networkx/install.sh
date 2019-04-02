# delete non-python files
find $1 -type f ! -name '*.py' -delete &> /dev/null

# delete tests
find $1 -name 'tests' -exec rm -rf {} \; &> /dev/null

# delete unnecessary
rm -rf $1/testing
rm -rf $1/drawing
rm -rf $1/readwrite
rm -rf $1/linalg
find $1/generators ! -name 'random_graphs.py' ! -name 'degree_seq.py' ! -name 'classic.py' -type f -exec rm -f {} \; &> /dev/null
rm -rf $1/algorithms

base_dir=$PWD
script_dir=`dirname $0`

# python fixes
cd $script_dir
python install.py $1
cd $base_dir

# patches
cp -a $script_dir/patch/. $1
