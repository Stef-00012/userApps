FROM oven/bun:debian

WORKDIR /bot

# Install required libraries
RUN apt update && apt install -y \
    dnsutils \
    bash \
    curl \
    wget

RUN arch=$(uname -m | awk '{if ($0 == "x86_64") print "amd64"; else print "aarch64"}')

# Install fastfetch
RUN wget https://github.com/fastfetch-cli/fastfetch/releases/latest/download/fastfetch-linux-${arch}.deb -O /tmp/fastfetch.deb && \
    apt -y install -f /tmp/fastfetch.deb && \
    rm -f /tmp/fastfetch.deb

COPY . .

RUN bun i

ENTRYPOINT ["bun", "run", "build"]