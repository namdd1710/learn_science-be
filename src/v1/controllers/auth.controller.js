import { createHmac } from "crypto";
import jwt from "jsonwebtoken";
import { _errors } from "../errors/errors.js";
import UsersModel from "../models/users.model.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const Login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UsersModel.findOne({ email: username });

    if (!user) {
      return res
        .status(400)
        .json(errorResponse(400, _errors.E001_001, _errors.E001_001));
    }

    const hmac = createHmac("sha256", process.env.SECRETKEY);
    hmac.update(password);
    const hash = hmac.digest("hex");
    if (hash !== user.password) {
      return res.status(400).json(errorResponse(400, _errors.E001_001, _errors.E001_001));
    }

    jwt.sign(
      { userId: user._id, roles: user.roles, phone: user.phone },
      process.env.SECRETKEY,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          res.status(500).json(errorResponse(500, err.message, err.message));
        } else {
          res.json(
            successResponse({
              access_token: token,
              expires_in: 7 * 24 * 3600,
              type: "bearer",
            })
          );
        }
      }
    );
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, error.message));
  }
};
