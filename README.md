# gj-aws-dynamodb

## Installation
In order to add this package to your service, run the following command:
```
npm i gj-aws-dynamodb
```

## Usage

```js
const dynamodb = require('gj-aws-dynamodb')

const main = async main() => {
    await dynamodb.create({
        name: 'tableName', 
        PK: 'PK',    // optional, defaults to PK if not defined
        SK: 'SK',    // optional, defaults to SK if not defined. If set to false, only a hash key with PK will be made, range key will be omitted
        GSI1: false, // optional, defaults to false if not defined
        GSI2: false  // optional, defaults to false if not defined
    })
    /*
    return {
        name: String,
        arn: String
    }
    */

    await dynamodb.getTable('tableName')
    /*
    return {
        name: String,
        arn: String
    }
    */


    await dynamodb.remove('tableName') 
    /*
    return tableName
    */
}
