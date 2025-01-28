import http from 'k6/http';
import { SharedArray } from 'k6/data';
import { generateRandomEmail, generateRandomPassword } from './src/helper/generator.js';
import { doRegister } from './src/scenario/register_email_scenario.js'
import { doLogin } from './src/scenario/login_email_scenario.js'
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
http.setResponseCallback(
  http.expectedStatuses(404, 401, 400, 409, { min: 200, max: 204 })
);
const users = new SharedArray('user', function() {
  /** @type {User[]} */
  const res = []
  for (let index = 0; index < 200; index++) {
    res.push({
      email: generateRandomEmail(),
      password: generateRandomPassword(8, 32), token: ""
    })
  }
  return res
});

export default async function() {
  /** @type {import("./src/types/config.js").Config} */
  const config = {
    baseUrl: __ENV.BASE_URL ? __ENV.BASE_URL : "http://localhost:8080",
    debug: __ENV.DEBUG ? true : false,
    runNegativeCase: true,
    verifyChanges: true
  }
  let usr = doRegister(config, users[Math.floor(Math.random() * users.length)])
  if (!usr.isCreated && usr.user) {
    const loginRes = doLogin(config, usr.user)
    if (loginRes) {
      usr.user = loginRes
      usr.isCreated = true
    }
  } else {
    return;
  }
  if (!usr.user) {
    return;
  }
}
