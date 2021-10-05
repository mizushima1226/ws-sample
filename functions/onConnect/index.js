const AWS = require("aws-sdk");

exports.handler = function (event, context, callback) {
  try {
    console.info("event", event)
    const { queryStringParameters: {category}, requestContext: {connectionId} } = event
    // リクエストメッセージからconnectionIdを取得して
    const params = {
      TableName: "ws_connection",
      Item: {
        connectionId,
        category,
        connectedAt: new Date().toISOString()
      }
    };
    
    // DynamoDBテーブルに保存する
    const client = new AWS.DynamoDB.DocumentClient();
    client.put(params, (err) => {
      if(err){
        console.error("failed put item", err);
        callback(null, {
          statusCode: 500,
          body: "Failed to connect: " + JSON.stringify(err)
        });
        return;
      }
      callback(null, {
        statusCode: 200,
        body: "Connected."
      });
    });
  } catch (error) {
    console.error("catch error", error);
    callback(null, {
      statusCode: 500,
      body: "Failed to connect: " + JSON.stringify(error)
    });
  }
};