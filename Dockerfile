FROM node
RUN mkdir /opt/domain-availability
COPY ./ /opt/domain-availability/
RUN chown -R node:node /opt/domain-availability
USER node
WORKDIR /opt/domain-availability
RUN npm install
RUN npm install grunt-cli
RUN node_modules/.bin/grunt copy
EXPOSE 3000
ENTRYPOINT ["npm", "start"]
