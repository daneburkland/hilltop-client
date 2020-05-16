# Hilltop-client

This project contains two applications:

`/extension`: A Chrome extension for recording browser flows using [Puppeteer](https://github.com/puppeteer/puppeteer)

`/src`: A React application whose features include 1) viewing the performance (including Tracing) of recorded browser flows and 2) scheduling automated test runs.

These applications are implemented to talk to this serverless API — which uses AWS Lambda and DynamoDB under the hood: https://github.com/daneburkland/hilltop-api
