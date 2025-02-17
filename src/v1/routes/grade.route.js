import { Router } from "express";
import { ROLE_ADMIN } from "../secure/roles.js";
import { AddNewGrade } from "../controllers/grade.controller.js";
import { checkAuthorization, CheckUserRolePermission } from "../middlewares/auth.middleware.js";

const gradeRoute = Router();
const userUrl = "/user/grade";
const adminUrl = "/admin/grade";

gradeRoute.post(`${adminUrl}/create-new-grade`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), AddNewGrade);


export default gradeRoute;
