const dev = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "notes-app-2-api-dev-attachmentsbucket-1mddgxto3whvy"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://fr89u57268.execute-api.us-east-1.amazonaws.com/dev"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_f5TVsvfvN",
    APP_CLIENT_ID: "2cpav2ousoppk3qtgetqei8987",
    IDENTITY_POOL_ID: "us-east-1:62485de4-af9c-433f-b980-20788ad4c24e"
  },
  puppeteer: {
    BACKEND_HOST: "http://localhost:8080"
  }
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
  // TODO: update when figure out EC2 deploy
  puppeteer: {
    BACKEND_HOST: "http://localhost:8080"
  }
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === "prod" ? prod : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};
