import { Router } from "express";
import { AddNewCategory, AdminGetAllCategories, AdminGetAllCategoriesByRestaurantId, DeleteCategory, UpdateCategory, UserGetAllCategoryByRestaurantId } from "../controllers/categories.controller.js";
import { CheckUserRolePermission, checkAuthorization } from "../middlewares/auth.middleware.js";
import { ROLE_ADMIN, ROLE_USER } from "../secure/roles.js";

const categoriesRoute = Router();
const userUrl = "/user/categories";
const adminUrl = "/admin/categories";
//admin
categoriesRoute.post(`${adminUrl}/create-new-category`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), AddNewCategory);
categoriesRoute.put(`${adminUrl}/update-a-category/:id`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), UpdateCategory);
categoriesRoute.put(`${adminUrl}/delete-a-category/:id`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), DeleteCategory);
categoriesRoute.post(`${adminUrl}/get-list-categories`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), AdminGetAllCategories);
categoriesRoute.post(`${adminUrl}/get-restaurant-categories/:restaurantId`,checkAuthorization,CheckUserRolePermission(ROLE_ADMIN), AdminGetAllCategoriesByRestaurantId);

//user
categoriesRoute.get(`${userUrl}/get-restaurant-categories/:restaurantId`,checkAuthorization,CheckUserRolePermission(ROLE_USER), UserGetAllCategoryByRestaurantId);

export default categoriesRoute;
