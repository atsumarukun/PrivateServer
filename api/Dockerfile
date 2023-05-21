FROM golang:1.20-alpine as build
COPY . /go/src/api
WORKDIR /go/src/api
RUN go build

FROM golang:1.20-alpine as exec
COPY --from=build /go/src/api /go/src/api
WORKDIR /go/src/api
