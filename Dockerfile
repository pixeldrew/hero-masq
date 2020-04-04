FROM node:alpine
LABEL maintainer="drew@foe.hn"

WORKDIR /usr/src/hero-masq

# fetch dnsmasq
RUN apk update \
	&& apk --no-cache add dnsmasq supervisor
#configure dnsmasq
RUN echo "conf-dir=/etc/dnsmasq.d,*.conf" > /etc/dnsmasq.conf
RUN mkdir -p /etc/default/
RUN mkdir -p /var/lib/dnsmasqd
RUN mkdir -p /var/log/supervisor/
RUN echo -e "ENABLED=1\nIGNORE_RESOLVCONF=yes" > /etc/default/dnsmasq

COPY package*.json ./

RUN npm install --production

COPY . .

ARG DNS

ENV DNS=$DNS
RUN npm run build

RUN ./scripts/configure.sh

EXPOSE 3000 53/tcp 53/udp 67/udp
ENV NODE_ENV="production";
ENTRYPOINT ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
