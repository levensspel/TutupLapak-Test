import { fail } from 'k6';
import { Client } from 'k6/experimental/redis';
import { RegisterTest } from './src/tests/registerTest';
import { LoginTest } from './src/tests/loginTest';
import { UploadFileTest } from './src/tests/fileTest';
import { GetProfileTest, PatchProfileTest } from './src/tests/profileTest';
import { PostActivityTest } from './src/tests/activityTest';
export const options = {
  scenarios: {
    ramping_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 50, },
        { duration: '30s', target: 200, },
        { duration: '1m', target: 800, },
        { duration: '1m', target: 1500, },
        { duration: '30s', target: 3000, },
        { duration: '30s', target: 6000, },
        { duration: '1m', target: 6000, }
      ]
    }
  },
  thresholds: {
    http_req_duration: [{
      threshold: 'avg < 2000', // Average latency below 2s
      abortOnFail: true,
      delayAbortEval: '10s'
    }],
  }
};

const smallFile = open('./src/figure/image-50KB.jpg', 'b');
const medFile = open('./src/figure/image-100KB.jpg', 'b');
const bigFile = open('./src/figure/image-200KB.jpg', 'b');
const invalidFile = open('./src/figure/sql-5KB.sql', 'b');
const redisClient = new Client('redis://localhost:6379')

export default async function() {
  const config = {
    baseUrl: __ENV.BASE_URL ? __ENV.BASE_URL : "http://localhost:8080",
    debug: __ENV.DEBUG ? true : false,
    runNegativeCase: true,
    verifyChanges: true
  }
  const tags = {
    env: "local"
  }
}

