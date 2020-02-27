# hero-masq
Copyright 2020 Drew Foehn <drew@foe.hn>
License: MIT

Lightweight web frontend for dnsmasq

Built with Next.js, Apollo GraphQL, React, Material ui

To run local dev install

```bash
git clone https://github.com/pixeldrew/hero-masq.git
cd hero-masq/
copy .env.default .env
npm install
npm run dev
```

ENV Options are as follows:
```bash
PORT=3000 # port to access webapp
USER_NAME=admin #admin username
PASSWORD=dnsMasq01 #admin password
JWT_SECRET=auniquetokenmakeitcomplex123 #jwt encoding token, keep this secret
HOST_IP=192.168.0.2/24 # host ip
ROUTER_IP=192.168.0.1 # gateway ip to send to DHCP clients
DNSMASQ_CONF_LOCATION="/usr/local/etc/dnsmasq.d/" # location to save configuration
```

Docker deployment works but requires network be set to host or setup like the docker-compose.yml example

If not running in Docker, I suggest running this in an iocage or something similar as root permissions are needed to 
start/stop dnsmasq and modify the dnsmasq configuration.

### How This Works


DNSMasq Configuration is written to ${DNSMASQ_CONF_LOCATION}/hero-masq.conf and the dnsmasq service is restarted.
The default dnsmasq.conf should have a conf-dir line like this (DNSMASQ_CONF_LOCATION should be the same as specified in the 
.env file):

```
conf-dir=/etc/dnsmasq.d,*.conf
``` 
