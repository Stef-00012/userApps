FROM oven/bun:debian

WORKDIR /bot

# Install required libraries
RUN apt update && apt install -y \
    dnsutils \
    bash \
    curl \
    wget

# Install fastfetch
RUN wget https://github.com/fastfetch-cli/fastfetch/releases/latest/download/fastfetch-linux-amd64.deb -O /tmp/fastfetch.deb && \
    apt -y install -f /tmp/fastfetch.deb && \
    rm -f /tmp/fastfetch.deb

COPY . .

RUN bun i

ENTRYPOINT ["bun", "run", "build"]