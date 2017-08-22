# ProTrack Serverless Schedule API

An schedule API implementation that parses and exposes ProTrack schedule data
based on an XML input. Built to run on AWS Lamba via the [Serverless Framework](https://serverless.com/)

### Setup
Currently the serverless stack does not automatically provision the Elasticsearch backend. A hosted Elasticsearch Service should be started on AWS.

From that service you will need:
1. Endpoint
2. Domain ARN

### Deploy
1. Create a `env.json` file based on the `env.json.example` file.
2. Set the AWS region that you plan to deploy to
3. Set the timezone that you expect the ProTrack XML exports to be represent
4. Set the `ES_ARN` and `ES_ENDPOINT` based on the Elasticsearch Service that you set up
5. Run the `serverless deploy` and specify the stage to deploy to with the `--stage` flag. By default it will deploy to `dev`
6. Update the access policy of the Elasticsearch Service to IAM Role of the API. This can be found under IAM roles in the AWS console.

If you receive something similar to ERR_CONTENT_DECODE then you may been to enable binary support for the generated API Gateway. Update the API Gateway (in AWS console) to add gzip support by adding `application/json` to the Binary Support list for the stage that was deployed to.