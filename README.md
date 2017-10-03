# ProTrack Serverless Schedule API

An schedule API implementation that parses and exposes ProTrack schedule data
based on an XML input. Built to run on AWS Lamba via the [Serverless Framework](https://serverless.com/)

## Setup

### AWS Resources
Currently the serverless stack does not automatically provision the Elasticsearch backend. A hosted Elasticsearch Service should be started on AWS.

From that service you will need:
1. Endpoint
2. Domain ARN

### Tools
1. [AWS CLI](https://aws.amazon.com/cli/) - Underlying CLI tool used for deploying to AWS
2. [Serverless Framework](https://serverless.com/framework/) - Node CLI for deploying Serverless projects

### Initial Deploy
1. Create a `env.json` file based on the `env.json.example` file.
2. Set the AWS region that you plan to deploy to
3. Set the timezone that you expect the ProTrack XML exports to be represent
4. Set the `ES_ARN` and `ES_ENDPOINT` based on the Elasticsearch Service that you set up
5. Run the `serverless deploy` and specify the stage to deploy to with the `--stage` flag. By default it will deploy to `dev`
6. Update the access policy of the Elasticsearch Service to IAM Role of the API. This can be found under IAM roles in the AWS console.

If you receive something similar to ERR_CONTENT_DECODE then you may been to enable binary support for the generated API Gateway. Update the API Gateway (in AWS console) to add gzip support by adding `application/json` to the Binary Support list for the stage that was deployed to.

### Updates
1. Use `serverless deploy` with the appropriate `--stage` argument to deploy updates. By default it will deploy to `dev`

## Usage

### Data Structure
The basic element that is returned is a JSON representation of an airing. Each airing contains airing specific data as well as the episode and show data that pertains to it.

### Ingestion
File ingestion works by uploading ProTrack XML files to the s3 bucket created by the application. Each file uploaded is expected to represent a single ProTrack channel. The process looks like:

1. ProTrack file is uploaded
2. File is read, parsed, and prepared for inserting to Elasticsearch
3. Channel is extracted from  the file and existing data from that channel is deleted
4. New data is inserted into Elasticsearch
5. Processed file is moved to a backup directory

### Endpoints
The API provides six endpoints for fetching information.

1. `/all` - Fetches as much of the ingested data as allowed by ElasticSearch. It is not recommended to use without filters
2. `/channel/{channel}` - Fetches all of the data for a single channel
3. `/show/{show}` - Fetches all of the data for a single show id
4. `/episode/{episode}` - Fetches all of the data for a single episode id
5. `/episode/{episode}/version/{version}` - Fetches all of the data for a single version of an episode
6. `/search/{search}` - Searches title and descriptions for the provided search term and returns all matching airings. The `search` endpoint does not use the default `start` and `end` values. It instead uses a 0 start time and a large integer end time.

### Optional Parameters
Two optional parameters are available for filtering down the fetched data.

1. `start` - A timestamp that will be used to remove all entries airing before the passed in value. If omitted, `start` will default to the start of the current day.
2. `end` - A timestamp that will be used to remove all entries airing after the passed in value. If omitted, `end` will default to the end of the current day.

