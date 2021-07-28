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