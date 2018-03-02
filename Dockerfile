FROM node
RUN mkdir /opt/domain-availability
COPY ./ /opt/domain-availability/
RUN chown -R node:node /opt/domain-availability
USER node
WORKDIR /opt/domain-availability
RUN npm install
RUN ls -lha
EXPOSE 3000
ENTRYPOINT ["npm", "start"]
