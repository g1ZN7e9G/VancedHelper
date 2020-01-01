#!/bin/bash
echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
docker push vancedhelper/backend:dev-"$TRAVIS_BUILD_NUMBER"