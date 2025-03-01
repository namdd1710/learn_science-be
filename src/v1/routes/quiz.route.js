import { Router } from "express";
import { checkAuthorization, CheckUserRolePermission } from "../middlewares/auth.middleware.js";
import { ROLE_ADMIN, ROLE_USER } from "../secure/roles.js";
import { AdminActiveQuizs, AdminCreateNewQuiz, AdminEditQuiz, AdminGetAQuiz, AdminGetListQuiz, AdminInActiveQuizs, UserGetQuizInformation } from "../controllers/quiz.controller.js";
import { CreateNewQuizRequest } from "../requests/quiz_controller-requests/create-new-quiz_request.js";

const quizRoute = Router();
const adminUrl = "/admin/quiz";
const userUrl = "/user/quiz";

quizRoute.post(`${adminUrl}/create-new-quiz`,checkAuthorization, CheckUserRolePermission(ROLE_ADMIN), CreateNewQuizRequest, AdminCreateNewQuiz);
quizRoute.get(`${adminUrl}/get-list-quiz`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), AdminGetListQuiz);
quizRoute.get(`${adminUrl}/get-a-quiz/:id`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), AdminGetAQuiz);
quizRoute.put(`${adminUrl}/edit-a-quiz/:id`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN),CreateNewQuizRequest,AdminEditQuiz);
quizRoute.post(`${adminUrl}/active-quiz`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), AdminActiveQuizs);
quizRoute.post(`${adminUrl}/inactive-quiz`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), AdminInActiveQuizs);

quizRoute.get(`${userUrl}/get-quiz-information/:id`,checkAuthorization,CheckUserRolePermission(ROLE_USER), UserGetQuizInformation);

export default quizRoute;