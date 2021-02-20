import { Request, Response } from "express";
import { Types } from "mongoose";
import { TemplateModel, TaskModel, UserModel } from "../models";
import { Encrypter, TokenGenerator, Validator } from "../shared";

class UserController {
  static async getAll(req: Request, res: Response) {
    try {
      const usersFound = await UserModel.find().exec();
      return res.status(200).json({ user: usersFound, count: usersFound.length });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }

  static async create(req: Request, res: Response) {
    const { email, name, password } = req.body;

    const validationBody = Validator.validateObjectKeys(req.body, "email name password");
    if (!validationBody.isOk) {
      return res.status(400).send(validationBody.message);
    }
    const validationEmail = Validator.validateEmail(email);
    if (!validationEmail.isOk) {
      return res.status(400).send(validationEmail.message);
    }

    try {
      const userFound = await UserModel.findOne({ email }).exec();
      if (userFound) return res.status(400).send("User already exist");

      const encrypter = new Encrypter();
      const tokenGenerator = new TokenGenerator();

      const hashedPassword = await encrypter.generate(password);
      const userCreated = await UserModel.create({
        _id: new Types.ObjectId(),
        email,
        name,
        password: hashedPassword,
      });
      const token = tokenGenerator.generate({ _id: userCreated._id, email: userCreated.email });

      return res.status(200).json({ user: userCreated, token });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const validationBody = Validator.validateObjectKeys(req.body, "email password");
    if (!validationBody.isOk) {
      return res.status(400).send(validationBody.message);
    }
    const validationEmail = Validator.validateEmail(email);
    if (!validationEmail.isOk) {
      return res.status(400).send(validationEmail.message);
    }

    try {
      const userFound = await UserModel.findOne({ email }).exec();
      if (!userFound) return res.status(400).send("User not found");

      const encrypter = new Encrypter();
      const tokenGenerator = new TokenGenerator();

      const passwordIsValid = await encrypter.compare(password, userFound.password);
      if (passwordIsValid) {
        const token = tokenGenerator.generate({ _id: userFound._id, email: userFound.email });
        return res.status(200).json({ user: userFound, token });
      }

      return res.status(400).send("Invalid credentials");
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
    const validationBody = Validator.validateObjectKeys(
      req.body,
      "email name password newPassword",
    );
    if (!validationBody.isOk) {
      return res.status(400).send(validationBody.message);
    }
    const validationEmail = Validator.validateEmail(email);
    if (!validationEmail.isOk) {
      return res.status(400).send(validationEmail.message);
    }

    try {
      const userFound = await UserModel.findOne({ email }).exec();
      if (!userFound) return res.status(400).send("User not found");

      const encrypter = new Encrypter();
      const passwordIsValid = await encrypter.compare(password, userFound.password);

      if (passwordIsValid) {
        if (password !== newPassword) {
          const hashedNewPassword = await encrypter.generate(newPassword);
          userFound.password = hashedNewPassword;
        }
        userFound.email = email;
        userFound.name = name;
        const userUpdated = await userFound.save();

        return res.status(200).json({ user: userUpdated });
      }

      return res.status(400).send("Invalid credentials");
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
      if (!userFound) return res.status(400).send(`User with id ${userId} not found`);

      const userTemplates = await TemplateModel.find({ _id: { $in: userFound.templates } }).exec();
      for (const template of userTemplates) {
        await TaskModel.remove({ _id: { $in: template.tasks } }).exec();
      }
      await TemplateModel.remove({ _id: { $in: userFound.templates } }).exec();
      const result = await UserModel.deleteOne({ _id: userId }).exec();

      return res.status(200).json({ user: result });
    } catch (error) {
      return res.status(500).json({ message: error.message, error });
    }
  }
}

export default UserController;
