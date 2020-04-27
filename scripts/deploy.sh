# config
git config --global user.email "travis@travis-ci.com"
git config --global user.name "Travis CI"

# git
cd public
git init
#git remote add origin "https://${GITHUB_TOKEN}@github.com/algrx/algorithmx-demo"
git remote add origin "https://github.com/algrx/algorithmx-demo"

# deploy
git add .
git commit -m "deploy demo"
git push -u origin master:gh-pages --force
