import { fail } from 'k6';
import { LoginTest } from "./src/tests/loginTest.js";
import { RegisterTest } from "./src/tests/registerEmailTest.js";

export const options = {
  vus: 1,
  iterations: 1
};

const smallFile = open('./src/figure/image-50KB.jpg', 'b');
const medFile = open('./src/figure/image-100KB.jpg', 'b');
const bigFile = open('./src/figure/image-200KB.jpg', 'b');
const invalidFile = open('./src/figure/sql-5KB.sql', 'b');

export default function() {
  /** @type {import("./src/types/config.js").Config} */
  const config = {
    baseUrl: __ENV.BASE_URL ? __ENV.BASE_URL : "http://localhost:8080",
    debug: __ENV.DEBUG ? true : false,
    runNegativeCase: true,
    verifyChanges: true
  }
  const tags = {
    env: "local"
  }

  // ===== AUTH TEST =====
  let users = []
  for (let index = 0; index < 2; index++) {
    const user = RegisterTest(config, tags)
    if (!user)
      fail("test stop on Register feature, please check the logs")
    users.push(user)
  }
  const user = users[0]
  LoginTest(user, config, tags)
}

