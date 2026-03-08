FROM golang:1.22-alpine AS build

WORKDIR /app
COPY go.mod ./
COPY main.go ./
RUN go build -o server .

FROM alpine:3.19

WORKDIR /app
COPY --from=build /app/server .

EXPOSE 8080

CMD ["./server"]
