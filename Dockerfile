FROM oven/bun:debian

WORKDIR /bot

# Install required libraries
RUN apt update && apt install -y \
    libpango1.0-dev \
    libpixman-1-dev \
    build-essential \
    libsqlite3-dev \
    libcairo2-dev \
    imagemagick \
    libjpeg-dev \
    pkg-config \
    dnsutils \
    python3 \
    ffmpeg \
    bash \
    curl \
    wget \
    g++

# Install fastfetch
RUN wget https://github.com/fastfetch-cli/fastfetch/releases/latest/download/fastfetch-linux-amd64.deb -O /tmp/fastfetch.deb && \
    apt -y install -f /tmp/fastfetch.deb && \
    rm -f /tmp/fastfetch.deb

COPY . .

RUN bun i

ENTRYPOINT ["bun", "run", "build"]