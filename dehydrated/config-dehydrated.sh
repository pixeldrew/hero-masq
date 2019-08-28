#!/bin/sh

CWD=`pwd`;

# create dehydtrated config
cat << CONFIG > $CWD/config
CONTACT_EMAIL=$__CONTACT_EMAIL
CA=$__CA
CONFIG

# create domains config
cat << CONFIG > $CWD/domains.txt
$HOST_NAME
CONFIG

# create cfhooks config
cat << CONFIG > $CWD/hooks/cfhookbash/config.sh
case \${1} in
	"$HOST_NAME")
		global_api_key="$__CF_KEY"
		zones="$__CF_ZONE"
		email="$__CONTACT_EMAIL"
	;;

esac
CONFIG

# create cfhooks deploy config
cat << CONFIG > $CWD/hooks/cfhookbash/deploy.sh
case \${1} in
	"$HOST_NAME")
		#do deploy stuff here...
		cd $CWD/certs
		ln -s $HOST_NAME/cert.pem
		ln -s $HOST_NAME/privkey.pem
		ln -s $HOST_NAME/chain.pem
		ln -s $HOST_NAME/fullchain.pem
	;;

esac
CONFIG

/dehydrated/dehydrated --register --accept-terms && /dehydrated/dehydrated -c -t dns-01 -k hooks/cfhookbash/hook.sh
