#!/usr/bin/env sh

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
