#!/bin/bash
mkdir -p certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout certs/selfsigned.key \
  -out certs/selfsigned.crt \
  -subj "/C=VN/ST=Hanoi/L=Hanoi/O=MyOrg/OU=IT/CN=localhost"
echo "Certificates generated in ./certs folder!"
