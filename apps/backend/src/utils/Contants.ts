import * as dotenv from 'dotenv';
dotenv.config();

export type GoogleCredential = {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
};

export const googleCredential: GoogleCredential = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackUrl: process.env.GOOGLE_CALLBACK_URL,
};
