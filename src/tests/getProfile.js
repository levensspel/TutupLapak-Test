import { isUser } from "../caster/caster.js";
import { isEqual, isExists } from "../helper/assertion.js";
import { generateRandomImageUrl, generateRandomName, generateRandomNumber, generateTestObjects } from "../helper/generator.js";
import { testGetAssert, testPatchJsonAssert } from "../helper/request.js";

/**
 * @param {User} user
 * @param {import("../types/config.d.ts").Config} config
 * @param {{[name: string]: string}} tags
 * @returns {User | undefined}
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

  const res = assertHandler(
    "valid payload", featureName, route, {}, positiveHeader,
    {
      ["should return 200"]: (v) => v.status === 200,
      ["should have email and equal"]: (v) => isEqual(v, "email", user.email),
      ["should have phone"]: (v) => isExists(v, "phone", ["string", null]),
      ["should have fileId"]: (v) => isExists(v, "fileId", ["string", null]),
      ["should have fileUri"]: (v) => isExists(v, "fileUri", ["string", null]),
      ["should have fileThumbnailUri"]: (v) => isExists(v, "fileThumbnailUri", ["string", null]),
      ["should have bankAccountName"]: (v) => isExists(v, "bankAccountName", ["string", null]),
      ["should have bankAccountHolder"]: (v) => isExists(v, "bankAccountHolder", ["string", null]),
      ["should have bankAccountNumber"]: (v) => isExists(v, "bankAccountNumber", ["string", null]),
    },
    config, tags,);
  if (res.isSuccess) {
    try {
      const jsonResult = res.res.json();
      if (jsonResult && isUser(jsonResult)) {
        return jsonResult
      }
    } catch (e) {
      console.log(featureName + " | failed to parse json", e)
    }
  }
}
