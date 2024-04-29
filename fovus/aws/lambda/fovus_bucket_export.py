import json
import boto3

dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    try:
        # Get the DynamoDB table reference
        table = dynamodb.Table('fovus_ddb')
        
        # Put the event data into DynamoDB table
        response = table.put_item(
            Item=event
        )
        
        # If successful, return a success response
        return {
            'statusCode': 200,
            'body': 'Event added to DynamoDB successfully'
        }
    except Exception as e:
        # If any error occurs, return an error response
        return {
            'statusCode': 500,
            'body': f'Error adding event to DynamoDB: {str(e)}'
        }