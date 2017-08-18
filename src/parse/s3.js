// @flow

const S3 = require('aws-sdk/clients/s3');

export type S3EventRecord = {
  s3: {
    bucket: {
      name: string,
      arn: string
    },
    object: {
      key: string
    }
  }
};

export function read(bucket, params: {}) {
  return bucket.getObject(params).promise();
}

export function toBucket(bucket_name: string) {
  return new S3({params: {Bucket: bucket_name}});
}

export function recordToData(record: S3EventRecord) {
  return read(toBucket(record.s3.bucket.name), {Key: record.s3.object.key});
}