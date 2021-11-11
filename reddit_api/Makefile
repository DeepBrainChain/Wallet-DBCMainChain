GO_VERSION=`go version`
GIT_COMMIT=`git rev-parse HEAD`
GIT_URL=`git remote -v`
BUILD_TIME=`git show -s --format=%cd`

LDFLAGS="-X 'main.goVersion=${GO_VERSION}' \
	-X 'main.gitCommit=$(GIT_COMMIT)' \
	-X 'main.gitUrl=${GIT_URL}' \
	-X 'main.commitTime=${COMMIT_TIME}'"

build:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags ${LDFLAGS}
