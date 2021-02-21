import validator from "validator";

interface validation {
  isOk: Boolean;
  message: string;
}

class Validator {
  validateObjectKeys(object: object, keysToCheck: string): validation {
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

  validateEmail(email: string): validation {
    let isOk = validator.isEmail(email);

    return {
      isOk,
      message: isOk ? "" : "Invalid email",
    };
  }
}

export default new Validator();
