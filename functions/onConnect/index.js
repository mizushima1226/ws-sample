const AWS = require("aws-sdk");

exports.handler = function (event, context, callback) {
  try {
    console.info("event", event)
    // リクエストメッセージからconnectionIdを取得して
    const params = {
      TableName: "ws_connection",
      Item: {
        category: "task",
        connection_id: event.requestContext.connectionId,
        connected_at: new Date().toISOString()
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