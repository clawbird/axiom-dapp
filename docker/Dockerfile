FROM docker.io/library/ubuntu:23.04

ENV HOME /root
WORKDIR $HOME/axiom

ARG RUST_NIGHTLY="2022-10-28"

ENV RUSTUP_HOME=$HOME/rustup \
    CARGO_HOME=$HOME/cargo \
    PATH=$HOME/cargo/bin:$PATH \
    DEBIAN_FRONTEND=noninteractive

COPY . $HOME/axiom

RUN apt-get -y update --fix-missing && \
  apt-get -y upgrade && \
  apt-get install -y build-essential pkg-config && \
  apt-get install -y git curl wget jq lsof unzip vim sudo && \
  # Rust. Note: Rust is not actually required to be installed by Axiom
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs/ | sh -s -- --default-toolchain nightly -y && \
  rustup component add rust-src rustfmt clippy && \
  rustup target add wasm32-unknown-unknown && \
	rustup toolchain install "nightly-${RUST_NIGHTLY}" --profile minimal --component rustfmt && \
	rustup default "nightly-${RUST_NIGHTLY}" && \
	rustup override set "nightly-${RUST_NIGHTLY}" && \
	# install wasm target into nightly toolchain
	rustup target add wasm32-unknown-unknown --toolchain "nightly-${RUST_NIGHTLY}" && \
  . $HOME/cargo/env && \
  rustc --version && \
  rustup show && \
  # Node.js and PNPM
  exec bash && \
  # Install latest LTS node
  curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash - && \
  apt-get install -y nodejs && \
  # Install pnpm
  npm install -g pnpm && \
  node --version && \
  SHELL=bash pnpm setup && \
  . $HOME/.bashrc && \
  # https://github.com/pnpm/pnpm/issues/4997
  rm -rf $HOME/axiom/.pnpm-store/v3/files && \
  pnpm install

CMD tail -f /dev/null