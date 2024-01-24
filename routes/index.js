var express = require('express');
var router = express.Router();
const AWS = require('aws-sdk');

// Set up AWS S3
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// POST route
router.post('/', (req, res) => {
  const content = req.body.Content;
  const params = {
    Bucket: BUCKET_NAME,
    Key: 'your-file-name.txt', // You might want to generate unique names
    Body: content
  };
  s3.upload(params, function(err, data) {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ message: 'File uploaded successfully', data });
  });
});

// GET route
router.get('/', (req, res) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: 'your-file-name.txt',
  };
  s3.getObject(params, function(err, data) {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(data.Body.toString());
  });
});

module.exports = router;