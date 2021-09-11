// const S3 = require('aws-sdk/clients/s3');
import S3 from 'aws-sdk/clients/s3';

function mapNameToBackupBucketName(name) {
  let stage = name.substring(name.lastIndexOf('-') + 1);
  let base = name.substring(0, name.lastIndexOf('-'));
  return base + '-backup' + '-' + stage;
}

export function toBucket(record) {
  return new S3({ params: { Bucket: record.s3.bucket.name } });
}

export function remove(bucket, record) {
  return bucket.deleteObject({ Key: record.s3.object.key }).promise();
}

export function backup(s3, record) {
  let backupName = mapNameToBackupBucketName(record.s3.bucket.name);
  let timestamp = Date.now();

  return s3.copyObject({
    Bucket: backupName,
    CopySource: '/' + record.s3.bucket.name + '/' + record.s3.object.key,
    Key: timestamp + '-' + record.s3.object.key
  }).promise();
}

export function read(bucket, params) {
  return bucket.getObject(params).promise();
}

export function toData(bucket, record) {
  return read(bucket, { Key: record.s3.object.key });
}