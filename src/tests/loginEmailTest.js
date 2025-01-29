import { isUser } from "../caster/caster.js";
import { isEqual, isExists } from "../helper/assertion.js";
import {
  combine,
  generateRandomEmail,
  generateTestObjects,
} from "../helper/generator.js";
import { testPostJsonAssert } from "../helper/request.js";

/**
 * @param {import("../types/config").Config} config
 * @param {{[name: string]: string}} tags
 * @param {User} user
 * @returns {User | undefined}
 */
export function LoginEmailTest(user, config, tags) {
  const featureName = "Login";
  const route = config.baseUrl + "/v1/login/email";
  const assertHandler = testPostJsonAssert;

  const positivePayload = {
    email: user.email,
    password: user.password,
  };

  if (config.runNegativeCase) {
    assertHandler(
      "empty body", featureName, route, {}, {},
      {
        ["should return 400"]: (v) => v.status === 400,
      },
      [], config, tags,);

    const testObjects = generateTestObjects(
      {
        email: {
          type: "string",
          notNull: true,
          isEmail: true,
        },
        password: {
          type: "string",
          notNull: true,
          minLength: 8,
          maxLength: 32,
        },
      },
      positivePayload,
    );
    testObjects.forEach((payload) => {
      assertHandler(
        "invalid payload", featureName, route, payload, {},
        {
          ["should return 400"]: (res) => res.status === 400,
        },
        [], config, tags,);
    });
    assertHandler(
      "email not exists",
      featureName, route, combine(positivePayload, {
        email: generateRandomEmail(),
      }),
      {},
      {
        ["should return 404"]: (res) => res.status === 404,
      },
      [], config, tags,);
  }

  const res = assertHandler(
    "valid payload", featureName, route, positivePayload, {},
    {
      ["should return 200"]: (v) => v.status === 200,
      ["should have email and equal"]: (v) => isEqual(v, "email", user.email),
      ["should have token"]: (v) => isExists(v, "token", ["string"]),
    },
    [], config, tags,);

  if (res.isSuccess) {
    try {
      const jsonResult = res.res.json();
      if (jsonResult && isUser(jsonResult)) {
        return combine(jsonResult, positivePayload)
      }
    } catch (e) {
      console.log(featureName + " | failed to parse json", e)
    }
  }
}
