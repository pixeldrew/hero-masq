#!/usr/bin/env bash

cat << CONFIG >> /etc/dnsmasq.conf
#use dnscrypt-proxy for upstream
server=172.31.0.32
domain-needed
no-resolv # otherwise unknown arpa requests will flood the internal docker dns back and forth
CONFIG

cat << CONFIG > /etc/supervisord.conf
[supervisord]
nodaemon=true

[program:dnsmasq]
command=/usr/sbin/dnsmasq

[program:hero-masq]
directory=/usr/src/hero-masq
command=/usr/bin/npm
CONFIG


