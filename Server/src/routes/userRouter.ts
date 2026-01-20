import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleAuthoriseMiddleware";
import { ROLES } from "../constants/rolesConstants";
import { userContainer } from "../container/container";
import { UserController } from "../controllers/userController";

const router = Router();

router.use(protect,authorize(ROLES.USER)); // for checking this jwt ondo and adding it to rhe req 

const userService = userContainer()
const userController = new UserController(userService)


router.get('/dashboard', authorize(ROLES.USER), userController.getDashboard); // client landing page, task pending
router.get('/profile', authorize(ROLES.USER), userController.getProfile);
router.patch('/profile', authorize(ROLES.USER), userController.updateProfile);  


router.get('/', userController.listUsers);          
router.get('/:id', userController.getUser);        

export default router;