import { Router } from "express";
import { AddNewQuestion, AdminActiveQuestions, AdminEditAQuestion, AdminGetAQuestion, AdminGetListQuestionPagination, AdminInActiveQuestions, UserGetListQuestionByLessonId } from "../controllers/question.controller.js";
import { checkAuthorization, CheckUserRolePermission } from "../middlewares/auth.middleware.js";
import { ROLE_ADMIN, ROLE_USER } from "../secure/roles.js";
import { CreateNewQuestionRequest } from "../requests/question_controller-requests/create-new-question_request.js";

const questionRoute = Router();
const userUrl = "/user/question";
const adminUrl = "/admin/question";

questionRoute.post(`${adminUrl}/create-new-question`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN),CreateNewQuestionRequest, AddNewQuestion);
questionRoute.put(`${adminUrl}/edit-a-question/:id`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN),CreateNewQuestionRequest, AdminEditAQuestion);
questionRoute.post(`${adminUrl}/active-questions`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), AdminActiveQuestions);
questionRoute.post(`${adminUrl}/inactive-questions`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN),AdminInActiveQuestions);
questionRoute.get(`${adminUrl}/get-a-question/:id`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN),AdminGetAQuestion);
questionRoute.get(`${adminUrl}/get-list-questions`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN),AdminGetListQuestionPagination);

questionRoute.get(`${userUrl}/get-list-questions/:lessonId`,checkAuthorization,CheckUserRolePermission(ROLE_USER), UserGetListQuestionByLessonId);


export default questionRoute;