import { Router } from "express";
import { ROLE_ADMIN, ROLE_USER } from "../secure/roles.js";
import { AddNewGrade, GetAGrade, GetAllGrade } from "../controllers/grade.controller.js";
import { checkAuthorization, CheckUserRolePermission } from "../middlewares/auth.middleware.js";
import { CreateNewGradeRequest } from "../requests/grade_controller-requests/create-new-grade_request.js";

const gradeRoute = Router();
const userUrl = "/user/grade";
const adminUrl = "/admin/grade";

gradeRoute.get(`${userUrl}/get-all-grades`,checkAuthorization,CheckUserRolePermission(ROLE_USER), GetAllGrade)

gradeRoute.post(`${adminUrl}/create-new-grade`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN),CreateNewGradeRequest, AddNewGrade);
gradeRoute.get(`${adminUrl}/get-a-grade/:id`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), GetAGrade);
gradeRoute.get(`${adminUrl}/get-all-grades`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), GetAllGrade);


export default gradeRoute;
