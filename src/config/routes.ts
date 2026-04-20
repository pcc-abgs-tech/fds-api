import { Router } from "express";
import FolderController from "../controllers/Folder.controller";
import FileController, { storage } from "../controllers/File.controller";
import AuthController from "../controllers/Auth.controller";
import RoleController from "../controllers/Role.controller";
import UserController from "../controllers/User.controller";
import PermissionController from "../controllers/Permission.controller";
import EntityController from "../controllers/Entity.controller";
import { Authentication } from "../middlewares/auth.middleware";
import SessionController from "../controllers/Session.controller";

const router = Router()

router.post("/auth/login", AuthController.login)
router.post("/auth/logout", Authentication, AuthController.logout)
router.get("/auth/current-user", AuthController.getCurrentUser)

router.post("/users", Authentication, UserController.create)
router.get("/users/:id", Authentication, UserController.get)
router.get("/users", Authentication, UserController.getAll)

router.post("/roles", RoleController.create)
router.get("/roles/:id", RoleController.get)
// router.get("/roles", RoleController.getAll)
router.get("/roles/:id/permissions", RoleController.getPermissions)

router.post("/permissions", PermissionController.create)
router.get("/permissions/:id", PermissionController.get)
router.get("/permissions", PermissionController.getAll)

router.get("/folders/:id/download", FolderController.download)
router.get("/folders/:id", FolderController.get)
router.post("/folders", FolderController.create)
router.post("/folders/:id/upload", storage.array("files"), FileController.upload)

router.get("/files/:id/download", FileController.download)
router.delete("/files/:id", FileController.destroy)

router.post("/entities", EntityController.create)
router.get("/entities/:id", EntityController.get)
router.get("/entities", EntityController.getAll)

router.get("/sessions", SessionController.getAll)
router.delete("/sessions/:id", SessionController.revoke)

export default router