#!/bin/bash

docker build -f docker/dockerfile -t loganlee/back-nia .
docker run -it -d -p 3401:4000 --name back-nia loganlee/back-nia