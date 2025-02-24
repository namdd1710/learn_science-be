import { Router } from "express";
import { AddNewUnit, AdminActiveUnits, AdminEditAnUnit, AdminGetAllUnits, AdminGetAnUnit, AdminInActiveUnits, UserGetAnUnit, UserGetGradeUnits } from "../controllers/unit.controller.js";
import { checkAuthorization, CheckUserRolePermission } from "../middlewares/auth.middleware.js";
import { ROLE_ADMIN, ROLE_USER } from "../secure/roles.js";
import { CreateNewUnitRequest } from "../requests/unit_controller-requests/create-new-unit_request.js";

const unitRoute = Router();
const userUrl = "/user/unit";
const adminUrl = "/admin/unit";

unitRoute.get(`${userUrl}/get-an-unit/:id`,checkAuthorization,CheckUserRolePermission(ROLE_USER), UserGetAnUnit);
unitRoute.get(`${userUrl}/get-grade-units/:id`,checkAuthorization,CheckUserRolePermission(ROLE_USER), UserGetGradeUnits);

unitRoute.post(`${adminUrl}/create-new-unit`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN),CreateNewUnitRequest, AddNewUnit);
unitRoute.put(`${adminUrl}/edit-an-unit/:id`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN),CreateNewUnitRequest, AdminEditAnUnit);
unitRoute.get(`${adminUrl}/get-an-unit/:id`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), AdminGetAnUnit);
unitRoute.get(`${adminUrl}/get-list-unit`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), AdminGetAllUnits);
unitRoute.post(`${adminUrl}/inactive-units`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), AdminInActiveUnits);
unitRoute.post(`${adminUrl}/active-units`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), AdminActiveUnits);


export default unitRoute;