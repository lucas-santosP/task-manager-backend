import jwt from "jsonwebtoken";

class TokenGenerator {
  secretKey: string | undefined;

  constructor() {
    this.secretKey = process.env.ACCESS_TOKEN_SECRET;
  }

  generate(value: Object) {
    if (!this.secretKey) throw new Error("Missing env value secretKey");

    const token = jwt.sign(value, this.secretKey);
    return token;
  }

  verify(token: string) {
    if (!this.secretKey) throw new Error("Missing env value secretKey");

    const decodedData = jwt.verify(token, this.secretKey);
    return decodedData;
  }
}

export default new TokenGenerator();
