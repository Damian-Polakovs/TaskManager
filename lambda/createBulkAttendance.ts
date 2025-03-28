import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getDb } from '../utils/database';
import { BulkAttendanceData } from '../models/attendance';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Received bulk attendance request');
    
    // Parse the request body
    const body = event.body ? JSON.parse(event.body) : {};
    console.log('Request body:', body);
    
    // Validate the request
    const data: BulkAttendanceData = body;
    if (!data.class_id || !data.date || !Array.isArray(data.records)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          success: false,
          message: 'Invalid request format. Required fields: class_id, date, records (array)'
        })
      };
    }
    
    // Connect to the database
    const db = await getDb();
    
    // Create the attendance record
    const attendance = {
      class_id: data.class_id,
      date: new Date(data.date),
      records: data.records.map(record => ({
        student_id: record.student_id,
        status: record.status,
        notes: record.notes || ''
      })),
      dateCreated: new Date(),
      lastUpdated: new Date()
    };
    
    // Insert into the database
    const result = await db.collection('attendances').insertOne(attendance);
    
    // Return success response
    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        success: true,
        message: 'Attendance records created successfully',
        data: { ...attendance, _id: result.insertedId }
      })
    };
  } catch (error) {
    console.error('Error creating bulk attendance:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        success: false,
        message: 'Error creating attendance records',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
