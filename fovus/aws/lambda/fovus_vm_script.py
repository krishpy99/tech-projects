import boto3

def lambda_handler(event, context):
    print(event)
    record = event['Records'][0]
    print(record)
    db_record = record['dynamodb']['NewImage']
    print(db_record)
    clean_record = {}
    for key, value in db_record.items():
        clean_record[key] = value['S']
    print(clean_record)
    
    ec2 = boto3.resource('ec2', region_name='us-west-1')  # Specify your AWS region

    # Define instance parameters
    response = ec2.create_instances(
        ImageId='fovus-ec2',  # Specify the AMI ID
        InstanceType='t2.micro',  # Specify the instance type
        KeyName='fovus-keypair',  # Specify the key pair name
        SecurityGroupIds=['sg-0d02b7de0dc53f14f'],  # Specify the security group IDs
        MinCount=1,
        MaxCount=1
    )
    
    print(response)

    # Extract the instance ID
    #instance_id = response['Instances'][0]['InstanceId']
    #print(f"Instance {instance_id} is being created.")
    
    
    
    # ec2.terminate_instances(InstanceIds=[instance_id])
    # print(f'Terminated EC2 instance with ID: {instance_id}')
    
    return {
        'statusCode': 200,
        'body': 'Processing completed'
    }