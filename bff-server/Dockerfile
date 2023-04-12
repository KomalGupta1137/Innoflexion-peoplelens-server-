FROM    gcr.io/iconic-nimbus-313106/pl-bff-base:0.4
USER    pl-bff
WORKDIR /opt/pl-bff
COPY    tsconfig.json /opt/pl-bff/
COPY    src/ /opt/pl-bff/src
COPY    config/ /opt/pl-bff/config
COPY    certs/ /opt/pl-bff/certs
USER    root
RUN     mkdir -p /opt/pl-bff/build
RUN     chown -R pl-bff:pl-bff /opt/pl-bff/src /opt/pl-bff/config /opt/pl-bff/package.json /opt/pl-bff/package-lock.json /opt/pl-bff/tsconfig.json /opt/pl-bff/certs /opt/pl-bff/build
USER    pl-bff
RUN     npm run build
RUN     rm -rf /opt/pl-bff/src /opt/pl-bff/config /opt/pl-bff/package.json /opt/pl-bff/package-lock.json /opt/pl-bff/certs /opt/pl-bff/tsconfig.json
WORKDIR /opt/pl-bff/build
ENV     NODE_ENV=production
CMD     node --inspect=127.0.0.1:9230 index.js
