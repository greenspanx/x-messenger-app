#
# "arn:aws:iam::165769518303:user/messenger001"
const awsConfig = {
  bucket: '<your-bucket>',
  accessKey: '<access-key>',
  secretKey: '<secret-key>',
  region: 'ap-southeast-2'
};

const development = {
  apiHost: 'http://localhost:3000',
  socketHost: 'http://localhost:4000',
  awsConfig
};

const production = {
  apiHost: 'http(s)://<api-host>:<PORT>',
  socketHost: 'http(s)://<socket-host>:<PORT>',
  awsConfig
};

#
install awscli for windows 64 bit
#
aws --version
#
aws configure
#
AWS Access Key ID [****************]:
AWS Secret Access Key [****************]:
Default region name [ap-southeast-2]: ap-southeast-2
Default output format [None]:
#
aws s3 ls
#
aws s3 ls s3://s3-sydney-x-mmessenger
#
aws s3 cp robot-prod.png s3://s3-sydney-x-messenger
#
AWS S3 Bucket Policy:
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Stmt1458840156000",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::165769518303:user/messenger001"
            },
            "Action": [
                "s3:GetObject",
                "s3:GetObjectAcl",
                "s3:GetObjectVersion",
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:PutObjectVersionAcl"
            ],
            "Resource": "arn:aws:s3:::s3-sydney-x-messenger/*"
        }
    ]
}
#
