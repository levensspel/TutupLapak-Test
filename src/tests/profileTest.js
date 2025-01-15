import { isEqual, isExists } from "src/helper/assertion.js";
import { testGetAssert } from "src/helper/request.js";

/**
 * @param {User} user
 * @param {import("../types/config.d.ts").Config} config
 * @param {{[name: string]: string}} tags
 */
export function GetProfileTest(user, config, tags) {
  const featureName = "Get Profile";
  const route = config.baseUrl + "/v1/user";
  const assertHandler = testGetAssert;

  const positiveHeader = {
    Authorization: `Bearer ${user.token}`,
  };
  if (config.runNegativeCase) {
    assertHandler(
      "empty token", featureName, route, {}, {},
      {
        ["should return 401"]: (v) => v.status === 401,
      },
      config, tags,
    );
    const negativeHeaders = [
      { Authorization: `${user.token}`, },
      { Authorization: `Bearer asdf${user.token}`, },
      { Authorization: ``, },
    ];

    negativeHeaders.forEach((header) => {
      assertHandler(
        "invalid token", featureName, route, {}, header,
        {
          ["should return 401"]: (res) => res.status === 401,
        },
        config, tags,);
    });
  }

  assertHandler(
    "valid payload", featureName, route, {}, positiveHeader,
    {
      ["should return 200"]: (v) => v.status === 200,
      ["should have email and equal"]: (v) => isEqual(v, "email", user.email),
      ["should have name"]: (v) => isExists(v, "name", ["string", null]),
      ["should have imageUri"]: (v) => isExists(v, "name", ["string", null]),
      ["should have height"]: (v) => isExists(v, "name", ["number", null]),
      ["should have weight"]: (v) => isExists(v, "name", ["number", null]),
      ["should have heightUnit"]: (v) => isExists(v, "name", ["string", null]),
      ["should have weightUnit"]: (v) => isExists(v, "name", ["string", null]),
      ["should have preference"]: (v) => isExists(v, "name", ["string", null]),
    },
    config, tags,);
}

