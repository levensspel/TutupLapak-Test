import http from 'k6/http';
import { check, sleep, fail } from 'k6';
import {
  generateRandomEmail,
} from "./src/helper/generator.js";

export const options = {
  stages: [
    { duration: '10s', target: 50, },
    { duration: '30s', target: 200, },
    { duration: '1m', target: 800, },
    { duration: '1m', target: 1500, },
    { duration: '30s', target: 3000, },
    { duration: '30s', target: 6000, },
    { duration: '1m', target: 6000, }
  ],
};

const BASE_URL = 'http://localhost:8080/v1';
const TEST_PASSWORD = 'asdfasdf';

// Helper function to parse response JSON safely
function parseJSON(response) {
  try {
    return JSON.parse(response.body);
  } catch (e) {
    console.error(`Failed to parse JSON. Response body: ${response.body}`);
    return null;
  }
}

export default function () {
  const TEST_EMAIL = generateRandomEmail(); // Generate a unique email for each virtual user

  // Test Register Endpoint
  const registerPayload = JSON.stringify({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  const registerHeaders = {
    'Content-Type': 'application/json',
  };

  const registerResponse = http.post(`${BASE_URL}/register/email`, registerPayload, {
    headers: registerHeaders,
  });

  const registerData = parseJSON(registerResponse);

  // Check register response
  check(registerResponse, {
    'register status is 201': (res) => res.status === 201,
    'register response is valid JSON': () => registerData !== null,
    'register response has email': () => registerData?.email === TEST_EMAIL,
    'register response has token': () => registerData?.token && registerData.token !== '',
  }) || fail('Registration test failed');

  // Simulate a pause before login
  sleep(1);

  // Test Login Endpoint
  const loginPayload = JSON.stringify({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  const loginResponse = http.post(`${BASE_URL}/login/email`, loginPayload, {
    headers: registerHeaders,
  });

  const loginData = parseJSON(loginResponse);

  // Check login response
  check(loginResponse, {
    'login status is 200': (res) => res.status === 200,
    'login response is valid JSON': () => loginData !== null,
    'login response has email': () => loginData?.email === TEST_EMAIL,
    'login response has token': () => loginData?.token && loginData.token !== '',
  }) || fail('Login test failed');

  // Add delay to simulate user behavior
  sleep(1);
}
