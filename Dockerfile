FROM node
COPY ./ /mail
WORKDIR /mail
RUN npm i npm -g
RUN npm i
RUN npm run build
CMD ["npm", "run", "start:prod"]