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

function mapNameToBackupBucketName(name: string): string {
  let stage = name.substring(name.lastIndexOf('-') + 1);
  let base = name.substring(0, name.lastIndexOf('-'));
  return base + '-backup' + '-' + stage;
}

export function remove(record: S3EventRecord) {
  return toBucket(record.s3.bucket.name).deleteObject({Key: record.s3.object.key}).promise();
}

export function backup(record: S3EventRecord) {
  let s3 = new S3();
  let backupName = mapNameToBackupBucketName(record.s3.bucket.name);
  let timestamp = Date.now();

  return s3.copyObject({
    Bucket: backupName,
    CopySource: '/' + record.s3.bucket.name + '/' + record.s3.object.key,
    Key: timestamp + '-' + record.s3.object.key
  }).promise();
}

export function read(bucket: S3, params: {}) {
  return bucket.getObject(params).promise();
}

export function toBucket(bucket_name: string): S3 {
  return new S3({params: {Bucket: bucket_name}});
}

export function recordToData(record: S3EventRecord) {
  let bucket = toBucket(record.s3.bucket.name);
  return read(bucket, {Key: record.s3.object.key});
}