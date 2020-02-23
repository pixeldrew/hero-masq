### hero-masq
Copyright 2020 Drew Foehn <drew@foe.hn>
License: MIT

Lightweight web frontend for dnsmasq

Built with Next.js, Apollo GraphQL, React, Material ui

To install

```bash
npm install
copy .env.default .env
npm run build
```

ENV Options are as follows:
```bash
PORT=3000 # port to access webapp
USER_NAME=admin #admin username
PASSWORD=dnsMasq01 #admin password
JWT_SECRET=auniquetokenmakeitcomplex123 #jwt encoding token, keep this secret
HOST_NAME=localhost #hostname where you will access hero-masq
HOST_IP=192.168.0.2/24 # host ip
ROUTER_IP=192.168.0.1 # gateway ip to send to DHCP clients
CONF_LOCATION="/usr/local/etc/dnsmasq.d/" # location to save configuration
SERVICE_MANAGER=service # options are supervisor for linux/docker hosts or service for freebsd
```

Docker works but requires net be set to host, see the docker-compose.yml for an example
