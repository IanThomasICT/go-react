build:
	cd app
	pnpm build
	cd ..	
	go build

clean: 
	rm -rf ./static/
