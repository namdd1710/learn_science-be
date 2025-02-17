import { Router } from "express";
import { Login } from "../controllers/auth.controller.js";

const authRoute = Router();
const userUrl = "/user/auth";
const adminUrl = "/admin/auth";

authRoute.post(`${userUrl}/token`, Login);


export default authRoute;
