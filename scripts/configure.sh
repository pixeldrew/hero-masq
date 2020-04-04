#!/usr/bin/env sh

if [ -z "${DNS}" ] ; then
	DNS="172.31.0.32"
fi

cat << CONFIG > /etc/dnsmasq.d/base.conf
log-facility=-
server=${DNS}
domain-needed
bogus-priv
no-hosts
no-resolv
expand-hosts
dhcp-leasefile=/var/lib/dnsmasqd/dnsmasq.leases
dhcp-name-match=set:wpad-ignore,wpad
dhcp-ignore-names=tag:wpad-ignore
stop-dns-rebind
except-interface=nonexisting
CONFIG

cat << CONFIG > /etc/supervisord.conf
[supervisord]
nodaemon = true
user = root

[supervisorctl]
serverurl = unix:///var/run/supervisor.sock
username = supervisor
password = supervisor

[unix_http_server]
file = /var/run/supervisor.sock
chmod = 0700
username = supervisor
password = supervisor

[rpcinterface:supervisor]
supervisor.rpcinterface_factory = supervisor.rpcinterface:make_main_rpcinterface

[program:dnsmasq]
command = /usr/sbin/dnsmasq -k
stdout_logfile = /var/log/supervisor/%(program_name)s.log
stderr_logfile = /var/log/supervisor/%(program_name)s.log
autorestart = true

[program:hero-masq]
directory = /usr/src/hero-masq
command = /usr/local/bin/npm start
stdout_logfile = /var/log/supervisor/%(program_name)s.log
stderr_logfile = /var/log/supervisor/%(program_name)s_error.log
CONFIG


