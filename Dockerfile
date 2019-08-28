FROM mhart/alpine-node:12
LABEL maintainer="drew@foe.hn"

WORKDIR /usr/src/hero-mask

# fetch dnsmasq
RUN apk update \
	&& apk --no-cache add dnsmasq
#configure dnsmasq
RUN mkdir -p /etc/default/
RUN echo -e "ENABLED=1\nIGNORE_RESOLVCONF=yes" > /etc/default/dnsmasq

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npm run build

EXPOSE 3000 53 67/udp
ENV NODE_ENV="production";
ENTRYPOINT ["npm","start"]
