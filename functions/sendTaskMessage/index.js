const AWS = require('aws-sdk');
const client = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, ctx, callback) => {
  const {data} = JSON.parse(event.body);
  const jsonData = JSON.stringify(data);
  
  const params = {
    TableName: "ws_connection",
    IndexName: "category-connectionId-index",
    KeyConditionExpression: "#c = :category",
    ExpressionAttributeNames: {
      "#c": "category",
    },
    ExpressionAttributeValues: {
      ":category": data.category,
    },
  };

  client.query(params, (err, data) => {
    if(err) {
      console.error("get error", err)
      const response = {
        statusCode: 500,
        body: { err },
      };
      callback(null, response);
      return;
    }
    const manager = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
      endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
    });

    data.Items?.forEach((item) => {
      if(item.connectionId === event.requestContext.connectionId) return;
      manager.postToConnection({ ConnectionId: item.connectionId, Data: jsonData }).promise();
    });

  });
  
  const response = {
      statusCode: 200,
      body: JSON.stringify('Send message from Lambda!'),
  };
  callback(null, response);
};
