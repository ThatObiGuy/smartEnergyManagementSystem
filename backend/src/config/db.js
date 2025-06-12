// importing neon
import { neon } from "@neondatabase/serverless";

// importing the dotenv config
import "dotenv/config";

// creating a SQL connection using our DB_URL from our dotenv file
export const sql = neon(process.env.DB_URL);