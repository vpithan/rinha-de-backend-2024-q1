# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM imbios/bun-node:1.0.29-21.6.2-slim as base
WORKDIR /usr/src/app

COPY . .
RUN bun install --frozen-lockfile && bun prisma generate

# run the app
USER bun
EXPOSE 9999
ENTRYPOINT [ "bun", "run", "server.ts" ]
