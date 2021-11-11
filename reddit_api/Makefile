GO_VERSION=`go version`
GIT_COMMIT=`git rev-parse --short HEAD`
COMMIT_TIME=`git show -s --format=%ci`

LDFLAGS="-X 'main.goVersion=${GO_VERSION}' \
	-X 'main.gitCommit=$(GIT_COMMIT)' \
	-X 'main.commitTime=${COMMIT_TIME}'"

build:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags ${LDFLAGS}
