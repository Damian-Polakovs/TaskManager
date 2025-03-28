import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getDb } from '../utils/database';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Received request for attendances');
    
    // Connect to the database
    const db = await getDb();
    
    // Query the attendances collection
    const attendances = await db.collection('attendances').find().toArray();
    
    // Return the results
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        success: true,
        data: attendances
      })
    };
  } catch (error) {
    console.error('Error fetching attendances:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        success: false,
        message: 'Error fetching attendances',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
