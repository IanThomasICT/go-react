dev:
	npm --prefix ./app run build:live &
	go run main.go

build:
	npm --prefix ./app run build
	go build

clean: 
	rm -rf ./static/**
