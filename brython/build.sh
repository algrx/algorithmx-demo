script_dir="$( cd `dirname $0`; pwd -P )"
brython_dir=$script_dir/dist/_brython
cd $script_dir

# clean
rm -rf dist/*

# build brython
mkdir -p $brython_dir && cd $brython_dir
python -m brython --install

cd $script_dir

# install modules
python -m pip install -r packages/requirements.txt -t $brython_dir --no-deps

# add fake decorator package
cp -a packages/decorator $brython_dir

# fix algorithmx
packages/algorithmx/install.sh $brython_dir/algorithmx

# fix networkx
packages/networkx/install.sh $brython_dir/networkx

# bundle modules
cd $brython_dir
python -m brython --modules
mv brython.js brython_modules.js $script_dir/dist
