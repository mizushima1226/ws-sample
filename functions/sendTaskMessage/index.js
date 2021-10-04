const AWS = require('aws-sdk');
const client = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, ctx, callback) => {
  console.info("event", event);
  console.info("ctx", ctx);

  const params = {
    TableName: "",
    Key: {
      "category": "",
    }
  };

  client.get(params, (err, data) => {
    if(err) {
      console.error("get error", err)
      const response = {
        statusCode: 500,
        body: { err },
      };
      callback(null, response);
      return;
    }
    console.info("get item", data);
  });
  
  // const connectionId = event.requestContext.connectionId;
  // const manager = new AWS.ApiGatewayManagementApi({
  //   apiVersion: '2018-11-29',
  //   endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  // });
  
  // await manager.postToConnection({ ConnectionId: connectionId, Data: connectionId + ":" + Date.now().toString() }).promise();
  
  const response = {
      statusCode: 200,
      body: JSON.stringify('Send message from Lambda!'),
  };
  callback(null, response);
};
