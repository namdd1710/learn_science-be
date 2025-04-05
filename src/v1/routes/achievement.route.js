import { Router } from "express";
import { checkAuthorization, CheckUserRolePermission } from "../middlewares/auth.middleware.js";
import { ROLE_ADMIN } from "../secure/roles.js";
import { CreateNewAchievementRequest } from "../requests/achievement_controller-requests/create-new-achievement_request.js";
import { AdminGetAnAchievement, AdminGetListAchievementPagination, CreateNewAchievement, EditAnAchievement } from "../controllers/achievement.controller.js";

const achievementRoute = Router()
const adminUrl = "/admin/achievement"

achievementRoute.post(`${adminUrl}/create-new-achievement`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN),CreateNewAchievementRequest,CreateNewAchievement )
achievementRoute.put(`${adminUrl}/edit-a-achievement/:id`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN),CreateNewAchievementRequest,EditAnAchievement )
achievementRoute.get(`${adminUrl}/get-list-achievement`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN),AdminGetListAchievementPagination )
achievementRoute.get(`${adminUrl}/get-a-achievement`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN),AdminGetAnAchievement )

export default achievementRoute