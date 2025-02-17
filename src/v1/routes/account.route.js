import { Router } from "express";
import { RegisterNewUser } from "../controllers/accounts.controller.js";

const accountRoute = Router();
const userUrl = "/user/account";
const adminUrl = "/admin/account";

accountRoute.post(`${userUrl}/register`, RegisterNewUser);


export default accountRoute;
