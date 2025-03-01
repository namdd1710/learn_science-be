import { Router } from "express";
import { checkAuthorization, CheckUserRolePermission } from "../middlewares/auth.middleware.js";
import { ROLE_USER } from "../secure/roles.js";
import { SubmitAnswerRequest } from "../requests/practice-quiz_controller-request/submit-answer_request.js";
import { CreateNewPracticeQuiz, GetPracticeQuizQuestion, SubmitPracticeQuiz } from "../controllers/practice-quiz.controller.js";

const practiceQuizRoute = Router();
const adminUrl = "/admin/practice-quiz";
const userUrl = "/user/practice-quiz";

practiceQuizRoute.post(`${userUrl}/create-new-practice-quiz/:id`,checkAuthorization, CheckUserRolePermission(ROLE_USER), CreateNewPracticeQuiz);
practiceQuizRoute.get(`${userUrl}/get-practice-quiz-question/:id`,checkAuthorization, CheckUserRolePermission(ROLE_USER), GetPracticeQuizQuestion);
practiceQuizRoute.post(`${userUrl}/submit-answer-practice/:id`,checkAuthorization, CheckUserRolePermission(ROLE_USER),SubmitAnswerRequest , SubmitPracticeQuiz);

export default practiceQuizRoute;