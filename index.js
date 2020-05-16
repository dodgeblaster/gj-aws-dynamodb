const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    region: 'us-east-2'
})

module.exports = {
    create: async ({ name, PK = 'PK', SK = 'SK' }) => {



        const params = {
            TableName: name,
            AttributeDefinitions: SK 
                ? [
                    {
                        AttributeName: PK,
                        AttributeType: "S"
                    },
                    {
                        AttributeName: SK,
                        AttributeType: "S"
                    }
                ] 
                : [
                    {
                        AttributeName: PK,
                        AttributeType: "S"
                    }
                ],
            KeySchema: SK ? [
                {
                    AttributeName: PK,
                    KeyType: "HASH"
                },
                {
                    AttributeName: SK,
                    KeyType: "RANGE"
                }
            ] : [
                {
                    AttributeName: PK,
                    KeyType: "HASH"
                }
            ],
            BillingMode: 'PAY_PER_REQUEST',
            // StreamSpecification: {
            //     StreamEnabled: true || false, /* required */
            //     StreamViewType: NEW_IMAGE | OLD_IMAGE | NEW_AND_OLD_IMAGES | KEYS_ONLY
            // }
        }

        console.log('--- ', params)

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