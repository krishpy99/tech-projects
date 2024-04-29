import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    try {
        // Define the DynamoDB table name
        const tableName = 'fovus_ddb';
        
        // Define the put parameters
        const params = {
            TableName: tableName,
            Item: event
        };
        
        // Put the event data into the DynamoDB table
        await docClient.send(new PutCommand(params));
        
        // If successful, return a success response
        return {
            statusCode: 200,
            body: 'Event added to DynamoDB successfully'
        };
    } catch (error) {
        // If any error occurs, return an error response
        return {
            statusCode: 500,
            body: `Error adding event to DynamoDB: ${error.message}`
        };
    }
};