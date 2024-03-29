import { Request, Response } from "express";
import { Types } from "mongoose";
import { TemplateModel, TaskModel, UserModel } from "../models";
import { encrypter, tokenGenerator, validator, createInitialTemplates } from "../shared";

class UserController {
  static async create(req: Request, res: Response) {
    const { email, name, password } = req.body;

    const validationBody = validator.validateObjectKeys(req.body, "email name password");
    if (!validationBody.isOk) {
      return res.status(400).send(validationBody.message);
    }
    const validationEmail = validator.validateEmail(email);
    if (!validationEmail.isOk) {
      return res.status(400).send(validationEmail.message);
    }

    try {
      const userFound = await UserModel.findOne({ email }).exec();
      if (userFound) return res.status(400).send("User already exist");

      const hashedPassword = await encrypter.generate(password);
      const userCreated = await UserModel.create({
        _id: new Types.ObjectId(),
        email,
        name,
        password: hashedPassword,
      });
      const token = tokenGenerator.generate({ _id: userCreated._id, email: userCreated.email });

      await createInitialTemplates.create(userCreated);

      return res.status(201).json({
        user: { _id: userCreated._id, name: userCreated.name, email: userCreated.email },
        token,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const validationBody = validator.validateObjectKeys(req.body, "email password");
    if (!validationBody.isOk) {
      return res.status(400).send(validationBody.message);
    }
    const validationEmail = validator.validateEmail(email);
    if (!validationEmail.isOk) {
      return res.status(400).send(validationEmail.message);
    }

    try {
      const userFound = await UserModel.findOne({ email }).exec();
      if (!userFound) return res.status(400).send("User not found");

      const passwordIsValid = await encrypter.compare(password, userFound.password);
      if (!passwordIsValid) return res.status(400).send("Invalid credentials");

      const token = tokenGenerator.generate({ _id: userFound._id, email: userFound.email });

      return res.status(200).json({
        user: { _id: userFound._id, name: userFound.name, email: userFound.email },
        token,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }

  static async auth(req: Request, res: Response) {
    const { userId } = req.params;

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user id received");
    }
    if (req.userId !== userId) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const userFound = await UserModel.findOne({ _id: userId }).exec();
      if (!userFound) return res.status(400).send("User not found");

      return res.status(200).json({
        user: { _id: userFound._id, name: userFound.name, email: userFound.email },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }

  static async update(req: Request, res: Response) {
    const { userId } = req.params;
    const { email, name, password, newPassword } = req.body;

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user id received");
    }
    if (req.userId !== userId) {
      return res.status(401).send("Unauthorized");
    }
    const validationBody = validator.validateObjectKeys(req.body, "email name password");
    if (!validationBody.isOk) {
      return res.status(400).send(validationBody.message);
    }
    const validationEmail = validator.validateEmail(email);
    if (!validationEmail.isOk) {
      return res.status(400).send(validationEmail.message);
    }

    try {
      const userFound = await UserModel.findOne({ email }).exec();
      if (!userFound) return res.status(400).send("User not found");

      const passwordIsValid = await encrypter.compare(password, userFound.password);
      if (!passwordIsValid) return res.status(400).send("Invalid credentials");

      if (newPassword && newPassword !== password) {
        const hashedNewPassword = await encrypter.generate(newPassword);
        userFound.password = hashedNewPassword;
      }
      userFound.email = email;
      userFound.name = name;
      const userUpdated = await userFound.save();

      return res.status(200).json({
        user: { _id: userUpdated._id, name: userUpdated.name, email: userUpdated.email },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }

  static async delete(req: Request, res: Response) {
    const { userId } = req.params;

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid task id received");
    }
    if (req.userId !== userId) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const userFound = await UserModel.findById(userId).exec();
      if (!userFound) return res.status(400).send("User not found");

      const userTemplates = await TemplateModel.find({ _id: { $in: userFound.templates } }).exec();
      for (const template of userTemplates) {
        await TaskModel.deleteMany({ _id: { $in: template.tasks } }).exec();
      }
      await TemplateModel.deleteMany({ _id: { $in: userFound.templates } }).exec();
      const result = await UserModel.deleteOne({ _id: userId }).exec();

      return res.status(200).json({ result });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }
}

export default UserController;
