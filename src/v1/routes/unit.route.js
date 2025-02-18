import { Router } from "express";
import { AddNewUnit } from "../controllers/unit.controller.js";
import { checkAuthorization, CheckUserRolePermission } from "../middlewares/auth.middleware.js";
import { ROLE_ADMIN } from "../secure/roles.js";
import { CreateNewUnitRequest } from "../requests/unit_controller-requests/create-new-unit_request.js";

const unitRoute = Router();
const userUrl = "/user/unit";
const adminUrl = "/admin/unit";

unitRoute.post(`${adminUrl}/create-new-unit`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN),CreateNewUnitRequest, AddNewUnit);


export default unitRoute;