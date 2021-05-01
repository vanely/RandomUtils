const _ = require('lodash')
const AWS = require('aws-sdk')
const oldRecord = require('./oldRecord.json')
const newRecord = require('./newRecord.json')
const marshalledRecord = require('./marshalledRecord.json')

const updateObj = {
  Creator: "Vanely",
  Message: "some other message",
  Title: "Some Other Title",
  User: "ieiie002023",
  Date: "Fri Apr 30 2021 17:45:57 GMT+0000 (Coordinated Universal Time)",
  OrgId: "jfgk9320gf",
}

const unmarshallDynamoRecord = (dynamoRecord) => {
  return AWS.DynamoDB.Converter.unmarshall(dynamoRecord)
}

const compareRecords = (oldRecord, newRecord) => {
  const updatedFields = Object.keys(newRecord).filter((prop) => oldRecord[prop] !== newRecord[prop])
  return _.pick(newRecord, updatedFields)
}


const omitFromObject = (oldRecord, newRecord) => {
  const leftOver = _.omit(newRecord, function(v, k) {return oldRecord[k] === v})
  return leftOver
}

const mapTableFieldsToPayloadFields = (tableName, data) => {
  let recordModel
  
  // should I simplify this more? May begin to sacrifice readability
  if (tableName === "table1") {
    recordModel = {
      massNotificationId: data.Id || null,
      operatorId: data.User || null,
      //seriesId,
      //createdBy,
      organizationId: data.OrgId || null,
      numberOfInvalidEntries: data.NumberOfInvalidEntries || null,
      createdAt: data.Date || null,
      updatedAt: data.Date || null,
    }
  } else if (tableName === "table2") {
    recordModel = {
      massNotificationId: data.MassNotificationId,
      //seriesId
      caseId: data.JobId,
      userId: data.UserId,
      organizationId: data.OrgId,
      massNoteStatusDimId,
      body: data.Message,
      createdAt: data.GeneratedAt,
      updatedAt: data.GeneratedAt,
    }
  }

  // map only fields in data to new object
  const fieldsToUpdate = Object.keys(recordModel).reduce((updateObj, currentKey) => {
    if (recordModel[currentKey] !== null) {
      updateObj[currentKey] = recordModel[currentKey]
    }
    return updateObj
  }, {})

  return fieldsToUpdate
}

// console.log(compareRecords(oldRecord, newRecord))
// console.log(omitFromObject(oldRecord, newRecord))
// console.log(mapTableFieldsToPayloadFields("MassNotificationFact", updateObj))
console.log(unmarshallDynamoRecord(marshalledRecord))