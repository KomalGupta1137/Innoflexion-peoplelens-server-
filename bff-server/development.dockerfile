FROM    node:14.19.0
RUN     useradd pl-bff -m -d /opt/pl-bff
USER    pl-bff
WORKDIR /opt/pl-bff
USER    root
COPY    nodemon.json /opt/pl-bff
COPY    package-lock.json /opt/pl-bff
COPY    package.json /opt/pl-bff
COPY    docker-run.sh /opt/pl-bff
COPY    tsconfig.json /opt/pl-bff/
COPY    src/ /opt/pl-bff/src
COPY    config/ /opt/pl-bff/config
COPY    certs/ /opt/pl-bff/certs
RUN     chmod +x /opt/pl-bff/docker-run.sh
RUN     mkdir -p /opt/pl-bff/src /opt/pl-bff/config /opt/pl-bff/certs
RUN     chown -R pl-bff:pl-bff /opt/pl-bff/src /opt/pl-bff/config /opt/pl-bff/package.json /opt/pl-bff/package-lock.json /opt/pl-bff/tsconfig.json /opt/pl-bff/certs /opt/pl-bff/nodemon.json
USER    pl-bff
RUN     NODE_TLS_REJECT_UNAUTHORIZED=0 npm install --trace-warnings --verbose --production=false
CMD     npm run build && npm run watch:build