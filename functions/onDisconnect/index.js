const AWS = require("aws-sdk");
const client = new AWS.DynamoDB.DocumentClient();

exports.handler = function (event, context, callback) {
  try {
    // リクエストメッセージからconnectionIdを取得して
    const params = {
      TableName: "ws_connection",
      Key: {
        "category": "task",
        "connection_id": event.requestContext.connectionId
      }
    };

    console.info("params",params)
  
    // DynamoDBのテーブルから削除
    client.delete(params, (err) => {
      if(err){
        console.error("failed delete item", err);
        callback(null, {
          statusCode: 500,
          body: "Failed to dis connect: " + JSON.stringify(err)
        });
        return;
      }
      callback(null, {
        statusCode: 200,
        body: "Dis Connected."
      });
    });
  } catch (error) {
    console.error("catch error", error);
    callback(null, {
      statusCode: 500,
      body: "error" + JSON.stringify(err)
    });
  }
};