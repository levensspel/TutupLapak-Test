/**
 * Returns the calories burned per minute for a given activity type
 * @param {ActivityType} activityType - The type of activity
 * @returns {number} Calories burned per minute
 */
export function getCaloriesPerMinute(activityType) {
  const caloriesMap = {
    'Walking': 4,
    'Yoga': 4,
    'Stretching': 4,
    'Cycling': 8,
    'Swimming': 8,
    'Dancing': 8,
    'Hiking': 10,
    'Running': 10,
    'HIIT': 10,
    'JumpRope': 10
  };

  return caloriesMap[activityType];
}

/**
 * @param {import("k6").JSONValue} value
 * @returns {value is User}
 */
export function isUser(value) {
  // Basic checks for object and required fields
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  /** @type {import("k6").JSONObject} */
  const obj = value;

  // Required fields check
  const requiredFields = ['email', 'token'];
  for (const field of requiredFields) {
    if (!(field in obj) || typeof obj[field] !== 'string') {
      return false;
    }
  }

  // Nullable string fields check
  const nullableStringFields = [
    'preferences',
    'weightUnit',
    'heightUnit',
    'weight',
    'height',
    'imageUri'
  ];

  for (const field of nullableStringFields) {
    if (field in obj) {
      const fieldValue = obj[field];
      if (fieldValue !== null && typeof fieldValue !== 'string') {
        return false;
      }
    }
  }

  return true;
}


/**
* @param {import("k6").JSONValue} value
* @returns {value is Activity}
*/
export function isActivity(value) {
  // Check if value is an object
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  /** @type {import("k6").JSONObject} */
  const obj = value;

  // Required string field check
  if (!('activityId' in obj) || typeof obj.activityId !== 'string') {
    return false;
  }

  // ActivityType enum check
  if (!('activityType' in obj) || typeof obj.activityType !== 'string' ||
    !Object.values(ActivityType).includes(/** @type {any} */(obj.activityType))) {
    return false;
  }

  // Number fields check
  const numberFields = ['durationInMinutes', 'caloriesBurned'];
  for (const field of numberFields) {
    if (!(field in obj) || typeof obj[field] !== 'number') {
      return false;
    }
  }

  // Date fields check - they come as strings in JSON and need to be valid dates
  const dateFields = ['doneAt', 'createdAt'];
  for (const field of dateFields) {
    if (!(field in obj) || typeof obj[field] !== 'string') {
      return false;
    }
    const date = new Date(obj[field]);
    if (isNaN(date.getTime())) {
      return false;
    }
  }

  return true;
}


