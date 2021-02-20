import validator from "validator";

interface validation {
  isOk: Boolean;
  message: string;
}

export default class Validator {
  static validateObjectKeys(object: object, keysToCheck: string): validation {
    let message = "";
    let isOk = true;
    const keys = keysToCheck.trim().split(" ");

    for (const key of keys) {
      if (!(object as any)[key]) {
        isOk = false;
        message = `Missing field ${key}`;
        break;
      }
    }

    return { isOk, message };
  }

  static validateEmail(email: string): validation {
    let isOk = validator.isEmail(email);

    return {
      isOk,
      message: isOk ? "" : "Invalid email",
    };
  }
}
