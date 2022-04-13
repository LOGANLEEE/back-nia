FROM node
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY yarn.lock ./
COPY ./ ./

RUN yarn

CMD [ "yarn" ]
CMD [ "yarn","prod" ]

# docker build -f docker/dockerfile -t loganlee/back-nia .
# docker run -it -d -p 3401:4000 --name back-nia loganlee/back-nia