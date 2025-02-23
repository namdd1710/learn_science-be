import { Router } from "express";
import { checkAuthorization, CheckUserRolePermission } from "../middlewares/auth.middleware.js";
import { ROLE_USER } from "../secure/roles.js";
import upload, { adminUploadImage, userUploadImage } from "../controllers/utilities.controller.js";


const utilitiesRoute = Router();
const userUrl = "/user/utilities";
const adminUrl = "/admin/utilities";

utilitiesRoute.post(`${userUrl}/upload-user`,upload.array("files"),checkAuthorization,CheckUserRolePermission(ROLE_USER),userUploadImage );

utilitiesRoute.post(`${adminUrl}/upload-admin`,upload.array("files"),checkAuthorization,CheckUserRolePermission(ROLE_USER),adminUploadImage );


export default utilitiesRoute;
