import 'dotenv/config';
// import * as server from '../app';
import { app, stop } from '../app';
import request from 'supertest';
import mongoose from 'mongoose';

let mgoose: typeof mongoose;

const port = process.env.PORT || 3001;
const baseUrl = `http://localhost:${port}`;
const apiVersion = 'v1';
const user = {
  email: 'support@cryptobyte.dev',
  password: 'M3n7m%tS+4J*%hzv'
};

beforeAll(async() => {
  mgoose = await mongoose.connect(process.env.DATA ?? '', {
    keepAlive: true,
    keepAliveInitialDelay: 300000
  });

  app;
});

afterAll(async() => {
  await mgoose.connection.dropDatabase();
  await mgoose.connection.close();
  await mgoose.disconnect();

  stop();
});

describe('Test User Authentication', () => {
  it('should sign up user..', async() => {
    const res = await request(`${baseUrl}/api/${apiVersion}`)
      .post('/user/signup')
      .send(user);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should sign in user..', async() => {
    const res = await request(`${baseUrl}/api/${apiVersion}`)
      .post('/user/signin')
      .send(user);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});