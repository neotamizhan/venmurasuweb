git checkout master
git add .
git commit -m "%1"

echo "Pushing to Github"
git push origin master

echo "Pushing to gh-pages branch"
git checkout gh-pages
git rebase master
git push origin gh-pages

echo Returning to master branch
git checkout master