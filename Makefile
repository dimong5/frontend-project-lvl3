#Makefile
lint:
		npx eslint .

lintfix:
		npx eslint --fix .

install:
		npm install
build: 
		npx webpack --mode=production
dev:
		npx webpack --mode=development
develop:
		npx webpack serve --mode development --env development