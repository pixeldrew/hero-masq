FROM node:lts-alpine3.12 as builder
LABEL maintainer="drew@foe.hn"

## Install build toolchain, install node deps and compile native add-ons
RUN apk add --no-cache python3 make g++ py3-pip

RUN mkdir -p /usr/src/hero-masq

WORKDIR /usr/src/hero-masq

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npm run build

FROM node:lts-alpine3.12 as app

WORKDIR /usr/src/hero-masq

RUN mkdir -p /usr/src/hero-masq

# fetch dnsmasq
RUN apk update \
	&& apk --no-cache add dnsmasq supervisor procps
#configure dnsmasq
RUN echo "conf-dir=/etc/dnsmasq.d,*.conf" > /etc/dnsmasq.conf
RUN mkdir -p /etc/default/
RUN mkdir -p /var/lib/dnsmasqd
RUN mkdir -p /var/log/supervisor/
RUN echo -e "ENABLED=1\nIGNORE_RESOLVCONF=yes" > /etc/default/dnsmasq

COPY package*.json ./

COPY --from=builder /usr/src/hero-masq/node_modules .
COPY --from=builder /usr/src/hero-masq/.next .

COPY . .

RUN chmod +x ./scripts/*.sh
RUN ./scripts/configure-supervisor.sh

ENV IN_DOCKER=true
ENV SERVICE_MANAGER=supervisor
ENV NODE_ENV=production
ENV DNSMASQ_CONF_LOCATION="/etc/dnsmasq.d/"
ENV DNS=1.1.1.1

EXPOSE 3000 53/tcp 53/udp 67/tcp 67/udp

ENTRYPOINT ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
