import { Router } from "express";
import { Login } from "../controllers/auth.controller.js";
import { LoginRequest } from "../requests/auth_controller-requests/login_request.js";

const authRoute = Router();
const userUrl = "/user/auth";
const adminUrl = "/admin/auth";

authRoute.post(`${userUrl}/token`,LoginRequest, Login);


export default authRoute;
