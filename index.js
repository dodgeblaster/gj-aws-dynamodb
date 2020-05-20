const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    region: 'us-east-2'
})

module.exports = {
    create: async ({ name, PK = 'PK', SK = 'SK', GSI1 = false, GSI2 = false }) => {
        
        const params = {
            TableName: name,
            AttributeDefinitions: [PK, SK, GSI1, GSI2]
                .filter(x => x)
                .map(x => ({
                    AttributeName: x,
                    AttributeType: "S"
                })),
            KeySchema: [PK, SK]
                .filter(x => x)
                .map(x => ({
                    AttributeName: x,
                    KeyType: x === 'PK' ? 'HASH' : 'RANGE'
                })),
            ...(GSI1 && SK && {
                GlobalSecondaryIndexes: [GSI1, GSI2]
                    .filter(x => x)
                    .map(x => ({
                        IndexName: x,
                        KeySchema: [
                            {
                                AttributeName: x, 
                                KeyType: 'HASH' 
                            },
                            {
                                AttributeName: 'SK', 
                                KeyType: 'RANGE'
                            }
                        ],
                        Projection: {
                            ProjectionType: 'ALL'
                        }
                    }))
            }),
            BillingMode: 'PAY_PER_REQUEST',
            // StreamSpecification: {
            //     StreamEnabled: true || false, /* required */
            //     StreamViewType: NEW_IMAGE | OLD_IMAGE | NEW_AND_OLD_IMAGES | KEYS_ONLY
            // }
        }

     
        const res = await dynamodb.createTable(params).promise()
        return {
            name: res.TableName,
            arn: res.TableArn
        }
    },


    getTable: async (name) => {
        const params = {
            TableName: name
        }
        const res = await dynamodb.describeTable(params).promise()
        return {
            name: res.Table.TableName,
            arn: res.Table.TableArn
        }
    },

    // update: async () => {
    // },

    remove: async (name) => {
        const params = {
            TableName: name
        }

        await dynamodb.deleteTable(params).promise()
        return name
    },
}