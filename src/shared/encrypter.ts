import bcrypt from "bcrypt";

export default class Encrypter {
  async compare(value: string, hashedValue: string) {
    if (!value) throw new Error("Missing param value");
    if (!hashedValue) throw new Error("Missing param hashedValue");

    const isValid = await bcrypt.compare(value, hashedValue);
    return isValid;
  }

  async generate(value: string) {
    if (!value) throw new Error("Missing param value");

    const hashedValue = await bcrypt.hash(value, 14);
    return hashedValue;
  }
}
