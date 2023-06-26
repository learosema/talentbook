#!/bin/sh
docker build -t talentbook-frontend:latest packages/frontend
docker build -t talentbook-backend:latest packages/backend

