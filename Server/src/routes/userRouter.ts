import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleAuthoriseMiddleware";
import { ROLES } from "../constants/rolesConstants";
import { 
    getUserDashboard, 
    getMyProfile, 
    updateMyProfile, 
    getUserById, 
    getAllUsers 
} from "../controllers/userController";

const router = Router();

router.use(protect); // for checking this jwt ondo and adding it to rhe req 

// --- Me (The Current User) ---
router.get('/dashboard', authorize(ROLES.USER), getUserDashboard); 
router.get('/profile', authorize(ROLES.USER), getMyProfile);
router.patch('/profile', authorize(ROLES.USER), updateMyProfile);  

// --- General User Resources ---
// Important: Place these AFTER /profile to strictly avoid ID collisions
router.get('/', getAllUsers);          
router.get('/:id', getUserById);        

export default router;