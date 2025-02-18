import { Router } from "express";
import { AdminCreateNewUser, RegisterNewUser } from "../controllers/accounts.controller.js";
import { RegisterNewAccountRequest } from "../requests/account_controller-requests/register-new-account_request.js";
import { CreateNewAccountRequest } from "../requests/account_controller-requests/create-new-account_request.js";

const accountRoute = Router();
const userUrl = "/user/account";
const adminUrl = "/admin/account";

accountRoute.post(`${userUrl}/register`,RegisterNewAccountRequest, RegisterNewUser);

accountRoute.post(`${adminUrl}/create-new-account`,CreateNewAccountRequest, AdminCreateNewUser);


export default accountRoute;
