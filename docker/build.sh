#!/bin/bash

while getopts ":u:p:" opt; do
  case $opt in
    u) $DOCKERHUB_USERNAME="$OPTARG"
    ;;
    p) $DOCKERHUB_PASSWORD="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    ;;
  esac
done

docker build -t akosfi/corebackend -f ./docker/Dockerfile .

echo $DOCKERHUB_PASSWORD | docker login -u $DOCKERHUB_USERNAME --password-stdin

docker push akosfi/corebackend:latest