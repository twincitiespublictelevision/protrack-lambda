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
3. Channel is extracted from the file and existing data from that channel is deleted
4. New data is inserted into Elasticsearch
5. Processed file is moved to a backup directory

### Endpoints

Swagger: https://twincitiespublictelevision.github.io/protrack-lambda/

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

---

## Lambda Functions Overview

### 1. ingest

**Purpose:**  
Triggered when a new ProTrack XML file is uploaded to the S3 ingest bucket.

**How it works:**

- Reads and parses the uploaded XML file.
- Extracts channel, show, and episode data.
- Removes existing data for the channel in Elasticsearch.
- Inserts new airings and show data into Elasticsearch.
- Moves the processed file to a backup S3 bucket and deletes the original.

**Input:**

- S3 event (file upload to `protrack-schedule-ingest-*` bucket)
- XML file representing a single ProTrack channel

**Output:**

- Updates Elasticsearch with new airings and shows.
- Moves file to backup S3 bucket.

---

### 2. all

**Purpose:**  
Fetches all ingested airing data (optionally filtered by time).

**How it works:**

- HTTP GET endpoint.
- Queries Elasticsearch for all airings, optionally filtered by `start` and `end` timestamps.

**Input:**

- HTTP GET `/all`
- Optional query parameters: `start`, `end` (timestamps)

**Output:**

- JSON array of airing objects (see OpenAPI schema for details).

---

### 3. channel

**Purpose:**  
Fetches all airings for a specific channel.

**How it works:**

- HTTP GET endpoint.
- Queries Elasticsearch for airings matching the given channel and optional time filters.

**Input:**

- HTTP GET `/channel/{channel}`
- Path parameter: `channel`
- Optional query parameters: `start`, `end`

**Output:**

- JSON array of airing objects for the channel.

---

### 4. show

**Purpose:**  
Fetches all airings for a specific show ID.

**How it works:**

- HTTP GET endpoint.
- Queries Elasticsearch for airings matching the given show ID and optional time filters.

**Input:**

- HTTP GET `/show/{show}`
- Path parameter: `show`
- Optional query parameters: `start`, `end`

**Output:**

- JSON array of airing objects for the show.

---

### 5. shows

**Purpose:**  
Fetches all shows in the system.

**How it works:**

- HTTP GET endpoint.
- Queries Elasticsearch for all unique shows.

**Input:**

- HTTP GET `/shows`

**Output:**

- JSON array of show objects.

---

### 6. episode

**Purpose:**  
Fetches all airings for a specific episode ID.

**How it works:**

- HTTP GET endpoint.
- Queries Elasticsearch for airings matching the given episode ID and optional time filters.

**Input:**

- HTTP GET `/episode/{episode}`
- Path parameter: `episode`
- Optional query parameters: `start`, `end`

**Output:**

- JSON array of airing objects for the episode.

---

### 7. version

**Purpose:**  
Fetches all airings for a specific version of an episode.

**How it works:**

- HTTP GET endpoint.
- Queries Elasticsearch for airings matching the given episode and version IDs and optional time filters.

**Input:**

- HTTP GET `/episode/{episode}/version/{version}`
- Path parameters: `episode`, `version`
- Optional query parameters: `start`, `end`

**Output:**

- JSON array of airing objects for the episode version.

---

### 8. search

**Purpose:**  
Searches airings by a search term in titles and descriptions.

**How it works:**

- HTTP GET endpoint.
- Queries Elasticsearch for airings where the search term matches the title or description.
- Uses a wide time range by default.

**Input:**

- HTTP GET `/search/{term}`
- Path parameter: `term`
- Optional query parameters: `start`, `end`

**Output:**

- JSON array of matching airing objects.

---

### 9. schedule

**Purpose:**  
Fetches the schedule for all channels for a specific day and granularity.

**How it works:**

- HTTP GET endpoint.
- Queries Elasticsearch for airings on the specified date, groups by channel and granularity.

**Input:**

- HTTP GET `/schedule/{year}/{month}/{day}/{granularity}`
- Path parameters: `year`, `month`, `day`, `granularity`

**Output:**

- JSON array of channel objects, each with their airings for the day.

---

### 10. schedule_channel

**Purpose:**  
Fetches the schedule for a specific channel for a specific day and granularity.

**How it works:**

- HTTP GET endpoint.
- Queries Elasticsearch for airings on the specified date and channel, groups by granularity.

**Input:**

- HTTP GET `/schedule/{year}/{month}/{day}/{granularity}/{channel}`
- Path parameters: `year`, `month`, `day`, `granularity`, `channel`

**Output:**

- JSON array of channel objects (filtered to the specified channel), each with their airings for the day.

---

### 11. health

**Purpose:**  
Monitors the health of the backup S3 bucket.

**How it works:**

- Triggered by S3 events on the backup bucket.
- Used for monitoring and alerting (e.g., via CloudWatch alarms).

**Input:**

- S3 event (file upload to `protrack-schedule-ingest-backup-*` bucket)

**Output:**

- Used for monitoring; no direct API output.

---

## API Endpoints Summary

| Endpoint                                                 | Method | Description                                           | Path Params                                      | Query Params   | Response Type |
| -------------------------------------------------------- | ------ | ----------------------------------------------------- | ------------------------------------------------ | -------------- | ------------- |
| `/all`                                                   | GET    | Fetch all airings (optionally filtered by time)       | –                                                | `start`, `end` | `[Airing]`    |
| `/channel/{channel}`                                     | GET    | Fetch all airings for a channel                       | `channel`                                        | `start`, `end` | `[Airing]`    |
| `/show/{show}`                                           | GET    | Fetch all airings for a show                          | `show`                                           | `start`, `end` | `[Airing]`    |
| `/shows`                                                 | GET    | Fetch all shows                                       | –                                                | –              | `[Show]`      |
| `/episode/{episode}`                                     | GET    | Fetch all airings for an episode                      | `episode`                                        | `start`, `end` | `[Airing]`    |
| `/episode/{episode}/version/{version}`                   | GET    | Fetch all airings for a specific episode version      | `episode`, `version`                             | `start`, `end` | `[Airing]`    |
| `/search/{term}`                                         | GET    | Search airings by term in title/description           | `term`                                           | `start`, `end` | `[Airing]`    |
| `/schedule/{year}/{month}/{day}/{granularity}`           | GET    | Fetch schedule for all channels for a day/granularity | `year`, `month`, `day`, `granularity`            | –              | `[Channel]`   |
| `/schedule/{year}/{month}/{day}/{granularity}/{channel}` | GET    | Fetch schedule for a channel for a day/granularity    | `year`, `month`, `day`, `granularity`, `channel` | –              | `[Channel]`   |

### Common Query Parameters

- `start` (integer, optional): Only include airings after this timestamp (defaults to start of current day)
- `end` (integer, optional): Only include airings before this timestamp (defaults to end of current day)

### Response Types

- **Airing**: An object representing a scheduled airing, including episode and show details.
- **Show**: An object representing a TV show.
- **Channel**: An object representing a channel and its airings.

For detailed schemas and example payloads, see the [Swagger/OpenAPI documentation](#).

---
