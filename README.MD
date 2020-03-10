# hero-masq

Copyright 2020 Drew Foehn <drew@foe.hn>
License: MIT

Lightweight web frontend for dnsmasq.

Built with Next.js, Apollo GraphQL, React and Material Ui

![Node.js CI](https://github.com/pixeldrew/hero-masq/workflows/Node.js%20CI/badge.svg)[![codecov](https://codecov.io/gh/pixeldrew/hero-masq/branch/master/graph/badge.svg)](https://codecov.io/gh/pixeldrew/hero-masq)

To test locally:

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
SERVICE_MANAGER=service # supports "service" for freebsd/debian installs or the docker controller "supervisor"
```

### How This Works

Dnsmasq should be running on the host you're running the frontend from. 

Dnsmasq configuration is written to ${DNSMASQ_CONF_LOCATION}/hero-masq.conf. The dnsmasq service is then sent a SIGHUP
 to reload it's config, flush it's cache and restart.
In order for this to work, the default dnsmasq.conf should have a conf-dir line like this:
```
conf-dir=/etc/dnsmasq.d,*.conf
``` 

Docker deployment works but requires the docker container to have their network to be configured as host or see the 
docker-compose.yml example for more advanced things like using a dns-crypt proxy

If you're not running in Docker, I suggest running this in an iocage or something similar as root permissions are 
needed to write dnsmasq configs and to reload the configs.

### Why?

I built this when I found out my new router couldn't run DD-WRT and only had a DHCP server with no integragated DNS. 
I like having a local dns so I have user friendly machine name access. 

### Future
See .plan if you're looking to help out
