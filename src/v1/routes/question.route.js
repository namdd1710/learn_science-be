import { Router } from "express";
import { AddNewQuestion } from "../controllers/question.controller.js";
import { checkAuthorization, CheckUserRolePermission } from "../middlewares/auth.middleware.js";
import { ROLE_ADMIN } from "../secure/roles.js";
import { CreateNewQuestionRequest } from "../requests/question_controller-requests/create-new-question_request.js";

const questionRoute = Router();
const userUrl = "/user/question";
const adminUrl = "/admin/question";

questionRoute.post(`${adminUrl}/create-new-question`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN),CreateNewQuestionRequest, AddNewQuestion);


export default questionRoute;