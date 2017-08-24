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

export function toBucket(record: S3EventRecord): S3 {
  return new S3({params: {Bucket: record.s3.bucket.name}});
}

export function remove(bucket: S3, record: S3EventRecord): Promise<*> {
  return bucket.deleteObject({Key: record.s3.object.key}).promise();
}

export function backup(s3: S3, record: S3EventRecord): Promise<*> {
  let backupName = mapNameToBackupBucketName(record.s3.bucket.name);
  let timestamp = Date.now();

  return s3.copyObject({
    Bucket: backupName,
    CopySource: '/' + record.s3.bucket.name + '/' + record.s3.object.key,
    Key: timestamp + '-' + record.s3.object.key
  }).promise();
}

export function read(bucket: S3, params: {}): Promise<*> {
  return bucket.getObject(params).promise();
}

export function toData(bucket: S3, record: S3EventRecord): Promise<*> {
  return read(bucket, {Key: record.s3.object.key});
}