import { Request, Response, NextFunction } from "express";
import { TokenGenerator } from "../shared";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(400).send("No token received");

    const tokenGenerator = new TokenGenerator();
    const decodedData = tokenGenerator.verify(token);
    console.log(decodedData);

    (decodedData as any).userId = (decodedData as any)._id;
    if (!(decodedData as any).userId) return res.status(401).send("Unauthorized");

    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500);
  }
};

export default auth;
