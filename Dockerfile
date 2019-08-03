FROM mhart/alpine-node:12
LABEL maintainer="drew@foe.hn"

# fetch dnsmasq
RUN apk update \
	&& apk --no-cache add dnsmasq \
	&& apk add --no-cache --virtual .build-deps curl \
	&& curl --compressed -o- -L https://yarnpkg.com/install.sh | bash
	&& apk del .build-deps
#configure dnsmasq
RUN mkdir -p /etc/default/
RUN echo -e "ENABLED=1\nIGNORE_RESOLVCONF=yes" > /etc/default/dnsmasq
COPY dnsmasq.conf /etc/dnsmasq.conf

RUN yarn install --production

#run!

EXPOSE 3000
ENV NODE_ENV="production";
ENTRYPOINT ["node","server.js"]
