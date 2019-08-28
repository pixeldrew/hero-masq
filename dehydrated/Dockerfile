FROM alpine:latest

RUN mkdir -p /dehydrated/hooks/cfhookbash

ADD ./config-dehydrated.sh /dehydrated

RUN apk add --update \
	grep \
    bash \
    curl \
    openssl \
    && rm -rf /var/cache/apk/* \
    && curl -L https://github.com/lukas2511/dehydrated/tarball/v0.6.5 --output dehydrated.tgz \
    && curl -L https://github.com/sineverba/cfhookbash/tarball/v2.2.1 --output cfhookbash.tgz \
    && tar xzf dehydrated.tgz -C /dehydrated --strip-components=1 \
    && tar xzf cfhookbash.tgz -C /dehydrated/hooks/cfhookbash --strip-components=1 \
    && rm -rf dehydrated.tgz cfhookbash.tgz

WORKDIR dehydrated

ENTRYPOINT ["./config-dehydrated.sh"]
