import { Router } from "express";
import { checkAuthorization, CheckUserRolePermission } from "../middlewares/auth.middleware.js";
import {  ROLE_USER } from "../secure/roles.js";
import { CreateNewAchievement } from "../controllers/achievement.controller.js";
import { AddUserAchievement, UserGetListAchievement } from "../controllers/user-achievement.controller.js";
import { UserAddAchievementRequest } from "../requests/user-achievement_controller-requests/user-add-achievement_request.js";

const userAchievementRoute = Router()
const userUrl = "/user/user-achievement"

userAchievementRoute.get(`${userUrl}/get-all-achievement`,checkAuthorization,CheckUserRolePermission(ROLE_USER),UserGetListAchievement )
userAchievementRoute.post(`${userUrl}/add-new-achievement`,checkAuthorization,CheckUserRolePermission(ROLE_USER),UserAddAchievementRequest,AddUserAchievement )

export default userAchievementRoute