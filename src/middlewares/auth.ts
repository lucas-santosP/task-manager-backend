import { Request, Response, NextFunction } from "express";
import { tokenGenerator } from "../shared";

interface IDecodedData {
  _id: string;
  email: string;
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(400).send("No token received");

    const decodedData = tokenGenerator.verify(token);
    if (!(decodedData as IDecodedData)._id) return res.status(401).send("Invalid token");

    req.userId = (decodedData as IDecodedData)._id;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500);
  }
};

export default auth;
