import { Router } from "express";
import { ROLE_ADMIN } from "../secure/roles.js";
import { AddNewGrade, GetAGrade } from "../controllers/grade.controller.js";
import { checkAuthorization, CheckUserRolePermission } from "../middlewares/auth.middleware.js";
import { CreateNewGradeRequest } from "../requests/grade_controller-requests/create-new-grade_request.js";

const gradeRoute = Router();
const userUrl = "/user/grade";
const adminUrl = "/admin/grade";

gradeRoute.post(`${adminUrl}/create-new-grade`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN),CreateNewGradeRequest, AddNewGrade);
gradeRoute.get(`${adminUrl}/get-a-grade/:id`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), GetAGrade);


export default gradeRoute;
