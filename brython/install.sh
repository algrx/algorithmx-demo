script_dir="$( cd `dirname $0`; pwd -P )"
brython_dir=$script_dir/_brython
cd $script_dir

# install brython
python -m pip install -r requirements.txt

# clean
rm -rf _brython _dist

# build brython
mkdir _brython && cd _brython
python -m brython --install
cd ..

# install modules
python -m pip install -r packages/requirements.txt -t _brython --no-deps

# add fake decorator package
cp -a packages/decorator $brython_dir

# fix algorithmx
packages/algorithmx/install.sh $brython_dir/algorithmx

# fix networkx
packages/networkx/install.sh $brython_dir/networkx

# bundle modules
cd $brython_dir
python -m brython --modules
mkdir ../_dist
cp brython.js brython_modules.js ../_dist
