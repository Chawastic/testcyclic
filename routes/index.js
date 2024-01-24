const express = require("express");
const router = new express.Router();
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

router.get('/', async function(req, res, next) {
  try {
    console.log("GET Request received");
    let my_file = await s3.getObject({
      Bucket: "cyclic-creepy-mite-beanie-eu-north-1",
      Key: "content.json",
    }).promise();

    console.log("S3 getObject Response:", my_file);
    const result = JSON.parse(my_file.Body)?.content;
    console.log("Parsed Content:", result);

    if(result == null) {
      res.json({
        status: "fail"
      });
    }
    else {
      res.json({
        status: "success",
        content: result,
      });
    }
  } catch (error) {
    console.error("Error in GET request:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("POST Request received, req.body:", req.body);
    const { content } = req.body;

    if (!content) {
      console.log("No content received");
      return res.status(400).json({ error: "No content provided" });
    }

    const contentObj = { content };
    console.log("Content to be uploaded:", contentObj);

    await s3.putObject({
      Body: JSON.stringify(contentObj, null, 2),
      Bucket: "cyclic-creepy-mite-beanie-eu-north-1",
      Key: "content.json",
    }).promise();

    console.log("Content uploaded successfully");
    res.json({
      status: "success",
      content: content,
    });
  } catch (error) {
    console.error("Error in POST request:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
