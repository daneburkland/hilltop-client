const dev = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "hilltop-api-dev-screenshotsbucket-12zwq9whcd1fo"
  },
  apiGateway: {
    notes: {
      REGION: "us-east-1",
      URL: "https://rumm7mf1g6.execute-api.us-east-1.amazonaws.com/dev"
    },
    recordingTasks: {
      REGION: "us-east-1",
      URL: "https://8lew15m0r8.execute-api.us-east-1.amazonaws.com/dev"
    }
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_6VMqfPDAU",
    APP_CLIENT_ID: "5frnp2tr3vtupqc2odcqarldaa",
    IDENTITY_POOL_ID: "us-east-1:30db3058-bc72-460b-b4ec-58fc5b0c07b0"
  },
  // hilltopChromeUrl: "http://hilltop.4hqtnd2p2p.us-east-1.elasticbeanstalk.com"
  hilltopChromeUrl: "http://localhost:8888"
};

const prod = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "notes-app-2-api-prod-attachmentsbucket-1j2mmdqw630sk"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://qvjsytkgm3.execute-api.us-east-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_suas7PkWu",
    APP_CLIENT_ID: "2v8fua873k5o6j3ib17tuf7ss6",
    IDENTITY_POOL_ID: "us-east-1:2d6e29f8-f166-45ea-967f-df4bac3b574f"
  },
  hilltopChromeUrl: "http://hilltop.4hqtnd2p2p.us-east-1.elasticbeanstalk.com"
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === "prod" ? prod : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};
