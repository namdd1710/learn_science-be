import { createHmac } from "crypto";
import jwt from "jsonwebtoken";
import { _apiCode, _errors } from "../errors/errors.js";
import UsersModel from "../models/users.model.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const Login = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await UsersModel.findOne({ userName: userName });

    if (!user) {
      return res.status(_apiCode.ERR_DEFAULT).json(
        errorResponse(_apiCode.ERR_DEFAULT, _errors.E001_001, _errors.E001_001)
      );
    }

    const hmac = createHmac("sha256", process.env.SECRETKEY);
    hmac.update(password);
    const hash = hmac.digest("hex");
    if (hash !== user.password) {
      return res.status(_apiCode.ERR_DEFAULT).json(
        errorResponse(_apiCode.ERR_DEFAULT, _errors.E001_001, _errors.E001_001)
      );
    }

    jwt.sign(
      {
        userId: user._id,
        roles: user.roles,
        phone: user.phone,
        userName: user.userName,
      },
      process.env.SECRETKEY,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          res.status(_apiCode.ERR_DEFAULT).json(errorResponse(_apiCode.ERR_DEFAULT, err.message, err.message));
        } else {
          res.status(_apiCode.SUCCESS).json(
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
    res.status(_apiCode.ERR_DEFAULT).json(errorResponse(_apiCode.ERR_DEFAULT, error.message, error.message));
  }
};
