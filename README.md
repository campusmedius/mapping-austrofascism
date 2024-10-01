# Mapping Austrofascism

Code for [Mapping Austrofascism](https://mapping-austrofascism.campusmedius.net/)

For mapping docs see [here](https://github.com/campusmedius/mapping-austrofascism/tree/master/mapping).


## Prerequisites

Create hosts entries

sudo vim /etc/hosts

Add the following entries:

```
127.0.0.1 mapping-austrofascism.campusmedius.net
::1 mapping-austrofascism.campusmedius.net
```

Install mkcert and create local development certificates:

```
brew install mkcert
mkcert -install
cd $NEXYO_PROJECT_ROOT
mkdir .certs
cd .certs
mkcert -cert-file cert.pem -key-file cert.key.pem "mapping-austrofascism.campusmedius.net"
cp "$(mkcert -CAROOT)/rootCA.pem" ./rootCA.crt
cd -
```

## Run

Run with docker compose:

```sh
docker-compose up
```

## Run webui in development

Run with docker compose overlay:

```sh
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Backup

Run the following commands to backup

```sh
scp -r root@campusmedius:/home/campusmedius/campusmedius/data/db backup/mapping-austrofascism/
scp -r root@campusmedius:/home/campusmedius/campusmedius/data/media backup/mapping-austrofascism/
```