import { Router } from "express";
import { AdminCreateNewUser, RegisterNewUser, UserUpdateImage } from "../controllers/accounts.controller.js";
import { RegisterNewAccountRequest, UserUpdateImageRequest } from "../requests/account_controller-requests/register-new-account_request.js";
import { CreateNewAccountRequest } from "../requests/account_controller-requests/create-new-account_request.js";
import { checkAuthorization, CheckUserRolePermission } from "../middlewares/auth.middleware.js";
import { ROLE_ADMIN, ROLE_USER } from "../secure/roles.js";

const accountRoute = Router();
const userUrl = "/user/account";
const adminUrl = "/admin/account";

accountRoute.post(`${userUrl}/register`,RegisterNewAccountRequest, RegisterNewUser);
accountRoute.put(`${userUrl}/update-image`,checkAuthorization,CheckUserRolePermission(ROLE_USER),UserUpdateImageRequest, UserUpdateImage);

accountRoute.post(`${adminUrl}/create-new-account`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN),CreateNewAccountRequest, AdminCreateNewUser);


export default accountRoute;
