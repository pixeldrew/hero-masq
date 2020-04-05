#!/usr/bin/env sh

if [ -z "${DNS}" ] ; then
	DNS="172.31.0.32#5353"
fi

if [ ! -f "${DNSMASQ_CONF_LOCATION}/base.conf" ] ; then

cat << CONFIG > ${DNSMASQ_CONF_LOCATION}/base.conf
log-facility=-
server=${DNS}
domain-needed
bogus-priv
no-hosts
no-resolv
expand-hosts
except-interface=nonexisting
dhcp-leasefile=/var/lib/dnsmasqd/dnsmasq.leases
dhcp-name-match=set:wpad-ignore,wpad
dhcp-ignore-names=tag:wpad-ignore
stop-dns-rebind
CONFIG

fi
