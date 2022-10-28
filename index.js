require("dotenv").config();
let AWS = require("aws-sdk");

let elasticTranscoder = new AWS.ElasticTranscoder({ region: "us-east-1" });

exports.handler = function (event, context, callback) {
  console.log("Welcome");
  let key = event.Records[0].s3.object.key;

  //The input file may have spaces so hence need to replace them with '+'
  let sourceKey = decodeURIComponent(key.replace(/\+/g, " "));

  //remove the extension
  let outputKey = sourceKey.split(".")[0];

  let params = {
    PipelineId: process.env.PipelineId,
    Input: {
      Key: sourceKey,
    },
    Outputs: [
      {
        Key: outputKey + "-1080p" + ".mp4",
        PresetId: "1351620000001-000001", //Generic 1080p
      },
      {
        Key: outputKey + "-720p" + ".mp4",
        PresetId: "1351620000001-000010", //Generic 720p
      },
      {
        Key: outputKey + "-web-720p" + ".mp4",
        PresetId: "1351620000001-100070", //Web Friendly 720p
      },
    ],
  };
  elasticTranscoder.createJob(params, function (error, data) {
    if (error) {
      callback(error);
    }
  });
};
