FROM rust:bookworm as builder

WORKDIR /usr/src/app
COPY . .

# Install CA certificates in builder stage
RUN apt-get update && \
    apt-get install -y ca-certificates && \
    rm -rf /var/lib/apt/lists/*

RUN cargo build --release

FROM debian:bookworm-slim

WORKDIR /usr/src/app

# Install CA certificates and OpenSSL (required for HTTPS connections)
RUN apt-get update && \
    apt-get install -y ca-certificates openssl && \
    rm -rf /var/lib/apt/lists/*

# Copy binary and config from builder
COPY --from=builder /usr/src/app/target/release/backend /usr/local/bin/app
COPY --from=builder /usr/src/app/Rocket.toml .

# Copy CA certificates from builder
COPY --from=builder /etc/ssl/certs /etc/ssl/certs

EXPOSE 8000

CMD ["app"]
