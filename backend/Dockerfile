FROM rust:bookworm AS builder

WORKDIR /usr/src/app
COPY . .

RUN apt-get update && \
    apt-get install -y ca-certificates && \
    rm -rf /var/lib/apt/lists/*

RUN cargo build --release


FROM debian:bookworm-slim

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y ca-certificates openssl && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/app/target/release/backend /usr/local/bin/app

COPY --from=builder /etc/ssl/certs /etc/ssl/certs

EXPOSE 8000

CMD ["app"]
