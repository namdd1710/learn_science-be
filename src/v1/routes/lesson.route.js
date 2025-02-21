import { Router } from "express";
import { AddNewLesson, AdminActiveLessons, AdminEditALesson, AdminGetALesson, AdminGetListLessonPagination, AdminInActiveLessons, UserGetALesson } from "../controllers/lesson.controller.js";
import { checkAuthorization, CheckUserRolePermission } from "../middlewares/auth.middleware.js";
import { ROLE_ADMIN, ROLE_USER } from "../secure/roles.js";
import { CreateNewLessonRequest } from "../requests/lesson_controller-requests/create-new-lesson_request.js";

const lessonRoute = Router();
const userUrl = "/user/lesson";
const adminUrl = "/admin/lesson";

lessonRoute.post(`${adminUrl}/create-new-lesson`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN),CreateNewLessonRequest, AddNewLesson);
lessonRoute.put(`${adminUrl}/edit-a-lesson/:id`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN),CreateNewLessonRequest, AdminEditALesson)
lessonRoute.get(`${adminUrl}/get-a-lesson/:id`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), AdminGetALesson)
lessonRoute.get(`${adminUrl}/get-list-lesson`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), AdminGetListLessonPagination)
lessonRoute.post(`${adminUrl}/active-lessons`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), AdminActiveLessons)
lessonRoute.post(`${adminUrl}/inactive-lessons`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), AdminInActiveLessons)

lessonRoute.get(`${userUrl}/get-a-lesson/:id`,checkAuthorization,CheckUserRolePermission(ROLE_USER), UserGetALesson);


export default lessonRoute;