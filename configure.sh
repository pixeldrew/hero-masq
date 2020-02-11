#!/usr/bin/env sh

if [ -z "${DNS}" ] ; then
	DNS="172.31.0.32"
fi

cat << CONFIG >> /etc/dnsmasq.conf
server=${DNS}
domain-needed
no-resolv # otherwise unknown arpa requests will flood the internal docker dns back and forth
dhcp-leasefile=/var/lib/dnsmasqd/dnsmasq.leases
bogus-priv
domain-needed
CONFIG

cat << CONFIG > /etc/supervisord.conf
[supervisord]
nodaemon=true
user=root

[supervisorctl]
serverurl=unix://%(here)s/supervisor.sock

[rpcinterface:supervisor]
supervisor.rpcinterface_factory = supervisor.rpcinterface:make_main_rpcinterface

[program:dnsmasq]
command=/usr/sbin/dnsmasq -k --log-queries
stdout_logfile=/var/log/supervisor/%(program_name)s.log
stderr_logfile=/var/log/supervisor/%(program_name)s_error.log
autorestart=true

[program:hero-masq]
directory=/usr/src/hero-masq
command=/usr/bin/npm start
stdout_logfile=/var/log/supervisor/%(program_name)s.log
stderr_logfile=/var/log/supervisor/%(program_name)s_error.log
CONFIG


