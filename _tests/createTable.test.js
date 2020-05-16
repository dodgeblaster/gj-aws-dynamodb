const dynamodb = require('../index')
const retry = require('async-retry')
describe('dynamo', () => {
    test('can create read and remove table', async () => {
        await dynamodb.create({name:'INT_TEST_TABLE'})

        const res = await dynamodb.getTable('INT_TEST_TABLE')
        expect(res.name).toBe('INT_TEST_TABLE')

        await retry(async bail => {
            // if anything throws, we retry
            await dynamodb.remove('INT_TEST_TABLE')
          }, {
            retries: 10
          })       
    }, 30000)

    
})