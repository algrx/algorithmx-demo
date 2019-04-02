const exec = require('child_process').exec

const script = `
# config
git config --global user.email "travis@travis-ci.com"
git config --global user.name "Travis CI"

# git
cd public
git init
git remote add origin "https://\${GITHUB_TOKEN}@github.com/\${GITHUB_REPO}.git"

# deploy
git add .
git commit -m "Deploy demo"
git push -u origin master:gh-pages --force
`

exec(script, (error, stdout, stderr) => {
  console.log(stdout)
  console.log(stderr)
})
