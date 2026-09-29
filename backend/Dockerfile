FROM docker.io/paritytech/ci-unified:bullseye-1.88.0-2025-06-27-v202507221446 AS builder

ARG PROFILE=release
WORKDIR /app

COPY . .

RUN cargo build --${PROFILE} --bins -j 2

# MAIN IMAGE FOR PEOPLE TO PULL --- small one#
FROM docker.io/debian:bullseye-slim
LABEL maintainer="Parity Technologies"
LABEL description="Substrate Telemetry Backend shard/core binaries, static build"

ARG PROFILE=release
WORKDIR /usr/local/bin

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /app/target/$PROFILE/telemetry_shard /usr/local/bin
COPY --from=builder /app/target/$PROFILE/telemetry_core /usr/local/bin

# Bullseye LTS ended 2026-08-31. The security index still names
# openssl 1.1.1w-0+deb11u8, but that .deb was removed from the mirror.
# Install the copy that remains in the main archive (1.1.1w-0+deb11u1).
RUN useradd -m -u 1000 -U telemetry && \
    sed -i '/debian-security/d' /etc/apt/sources.list && \
    apt-get -y update && \
    apt-get -y install --no-install-recommends openssl && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/

USER telemetry
EXPOSE 8000
