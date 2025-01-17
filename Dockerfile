FROM imbios/bun-node:latest-22-slim

WORKDIR /bot

# Install required libraries
RUN apt update && apt install -y \
    dnsutils \
    bash \
    curl \
    wget

# Install fastfetch
RUN ARCH=$(uname -m | awk '{if ($0 == "x86_64") print "amd64"; else print "aarch64"}') && \
    wget https://github.com/fastfetch-cli/fastfetch/releases/latest/download/fastfetch-linux-$ARCH.deb -O /tmp/fastfetch.deb && \
    apt -y install -f /tmp/fastfetch.deb && \
    rm -f /tmp/fastfetch.deb

COPY . .

RUN bun i

ENTRYPOINT ["/bin/bash", "/bot/entrypoint.sh"]