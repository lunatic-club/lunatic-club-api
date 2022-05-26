FROM node:14.7.0 AS build

# Install essential tools
RUN apt-get -qq update && \
    apt-get -qq install sudo && \
    apt-get -qq install apt-transport-https && \
    apt-get -qq install build-essential && \
    apt-get -qq install git

RUN curl -sL https://deb.nodesource.com/setup_17.x | bash -
RUN apt-get -qq install -y nodejs

# install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get -qq install -y yarn

COPY ./ /usr/api

WORKDIR /usr/api
RUN yarn install
RUN yarn cache clean

FROM node:14.7.0-alpine

COPY --from=build /usr/api /api

WORKDIR /api
CMD ["yarn", "start"]
