FROM golang AS builder
WORKDIR /build
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo \
   -ldflags="-s -w" -o main

FROM alpine
WORKDIR /app
COPY --from=builder /build/main ./
COPY --from=builder /build/.env ./
ENV TZ=Asia/Shanghai GIN_MODE=release
EXPOSE 8081
CMD ["./main"]