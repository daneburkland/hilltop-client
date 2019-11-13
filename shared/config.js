const dev = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "hilltop-recording-api-dev-screenshotsbucket-1o92v30kzdml"
  },
  apiGateway: {
    recordings: {
      REGION: "us-east-1",
      URL: "https://32glk1pf2h.execute-api.us-east-1.amazonaws.com/dev"
    },
    recordingTests: {
      REGION: "us-east-1",
      URL: "https://5g9m8qjr7e.execute-api.us-east-1.amazonaws.com/dev"
    },
    userSettings: {
      REGION: "us-east-1",
      URL: "https://qss5dwscz6.execute-api.us-east-1.amazonaws.com/dev"
    },
    teams: {
      REGION: "us-east-1",
      URL: "https://gzrd8bmm74.execute-api.us-east-1.amazonaws.com/dev"
    },
    users: {
      REGION: "us-east-1",
      URL: "https://sb1bn1ima2.execute-api.us-east-1.amazonaws.com/dev"
    }
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_zCjgzgSvP",
    APP_CLIENT_ID: "1vfi43gsg3q4bsqiegmsm9ppko",
    IDENTITY_POOL_ID: "us-east-1:f333a17e-9c82-48cf-8812-1ef968d9d838"
  },
  hilltopChromeUrl: "https://hilltopchrome.com",
  hilltopChromeUrlLocal: "http://localhost:8888",
  hilltopChromeDomain: "hilltopchrome.com",
  hilltopChromeDomainLocal: "localhost:8888"
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
