import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleAuthoriseMiddleware";
import { ROLES } from "../constants/rolesConstants";
import { userContainer } from "../container/container";
import { UserController } from "../controllers/userController";

const router = Router();

router.use(protect); // verify token, but let specific routes authorize roles

const userService = userContainer()
const userController = new UserController(userService)


router.get('/dashboard', authorize(ROLES.USER), userController.getDashboard); // client landing page, task pending
router.get('/profile', authorize(ROLES.USER, ROLES.PROVIDER), userController.getProfile);
router.patch('/profile', authorize(ROLES.USER, ROLES.PROVIDER), userController.updateProfile);  


router.get('/', authorize(ROLES.USER), userController.listUsers);          
router.get('/:id', authorize(ROLES.USER), userController.getUser);        

export default router;