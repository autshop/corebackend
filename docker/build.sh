#!/bin/bash

while [ $# -gt 0 ]; do
  case "$1" in
    --u=*)
      DOCKERHUB_USERNAME="${1#*=}"
      ;;
    --p=*)
      DOCKERHUB_PASSWORD="${1#*=}"
      ;;
    *)
      printf "***************************\n"
      printf "* Error: Invalid argument.*\n"
      printf "***************************\n"
      exit 1
  esac
  shift
done

docker build -t akosfi/core-api -f ./docker/Dockerfile .

echo $DOCKERHUB_PASSWORD | docker login -u $DOCKERHUB_USERNAME --password-stdin

docker push akosfi/core-api:latest