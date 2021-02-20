import jwt from "jsonwebtoken";
import env from "../env";

export default class TokenGenerator {
  secretKey: string;

  constructor() {
    this.secretKey = env.ACCESS_TOKEN_SECRET;
  }

  generate(value: Object) {
    if (!this.secretKey) throw new Error("Invalid param secretKey");

    const token = jwt.sign(value, this.secretKey);
    return token;
  }

  verify(token: string) {
    if (!this.secretKey) throw new Error("Invalid param secretKey");

    const decodedData = jwt.verify(token, this.secretKey);
    return decodedData;
  }
}
