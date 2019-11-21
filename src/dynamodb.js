const { DynamoDB } = require('aws-sdk')

module.exports = new DynamoDB.DocumentClient()