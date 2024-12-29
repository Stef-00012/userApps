FROM oven/bun:debian

WORKDIR /bot

# Install required libraries
RUN apt update && apt install -y \
    libpango1.0-dev \
    libpixman-1-dev \
    build-essential \
    libncurses5-dev \
    libreadline-dev \
    libsqlite3-dev \
    libcairo2-dev \
    imagemagick \
    libjpeg-dev \
    libgdbm-dev \
    libnss3-dev \
    libbz2-dev \
    libffi-dev \
    libssl-dev \
    zlib1g-dev \
    pkg-config \
    dnsutils \
    python3 \
    ffmpeg \
    bash \
    curl \
    wget \
    g++

# Install Python3
RUN wget https://www.python.org/ftp/python/3.11.9/Python-3.11.9.tgz \
    && tar -xf Python-3.11.*.tgz \
    && cd Python-3.11.9 \
    && ./configure --enable-optimizations \
    && make -j $(nproc) \
    && make altinstall \
    && cd .. \
    && rm -rf Python-3.11.9 \
    && rm Python-3.11.*.tgz \
    && wget https://www.python.org/ftp/python/3.12.3/Python-3.12.3.tgz \
    && tar -xf Python-3.12.*.tgz \
    && cd Python-3.12.3 \
    && ./configure --enable-optimizations \
    && make -j $(nproc) \
    && make altinstall \
    && cd .. \
    && rm -rf Python-3.12.3 \
    && rm Python-3.12.*.tgz

# Update pip
RUN pip3.11 install --upgrade pip \
    && pip3.12 install --upgrade pip

# Install AppRise
RUN pip install apprise

# Add pip install path to PATH
# (idk why without this it gave errors when using apprise through `execSync`)
ENV PATH="${PATH}:/usr/local/bin"

# Install fastfetch
RUN wget https://github.com/fastfetch-cli/fastfetch/releases/latest/download/fastfetch-linux-amd64.deb -O /tmp/fastfetch.deb && \
    apt -y install -f /tmp/fastfetch.deb && \
    rm -f /tmp/fastfetch.deb

COPY . .

RUN bun i

ENTRYPOINT ["bun", "run", "build"]