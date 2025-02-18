import { Router } from "express";
import { AddNewLesson } from "../controllers/lesson.controller.js";
import { checkAuthorization, CheckUserRolePermission } from "../middlewares/auth.middleware.js";
import { ROLE_ADMIN } from "../secure/roles.js";
import { CreateNewLessonRequest } from "../requests/lesson_controller-requests/create-new-lesson_request.js";

const lessonRoute = Router();
const userUrl = "/user/lesson";
const adminUrl = "/admin/lesson";

lessonRoute.post(`${adminUrl}/create-new-lesson`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN),CreateNewLessonRequest, AddNewLesson);


export default lessonRoute;