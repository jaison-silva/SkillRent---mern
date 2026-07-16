import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleAuthoriseMiddleware";
import { ROLES } from "../constants/rolesConstants";
import { ProviderContainer } from "../container/container";
import { ProviderController } from "../controllers/providerController";

const router = Router();

router.use(protect);

const providerService = ProviderContainer()
const providerController = new ProviderController(providerService)

import { jobContainer } from "../container/container";
import { JobController } from "../controllers/jobController";
const jobService = jobContainer();
const jobController = new JobController(jobService);

// self
router.get('/profile', authorize(ROLES.PROVIDER), providerController.getProfile);
router.patch('/profile', authorize(ROLES.PROVIDER), providerController.updateProfile);


router.get('/', authorize(ROLES.USER, ROLES.ADMIN, ROLES.PROVIDER), providerController.listProviders);
router.get('/:id', authorize(ROLES.USER, ROLES.ADMIN, ROLES.PROVIDER), providerController.getProviderById);

import { reviewContainer } from "../container/container";
import { ReviewController } from "../controllers/reviewController";

const reviewService = reviewContainer();
const reviewController = new ReviewController(reviewService);

router.get('/:providerId/reviews', authorize(ROLES.USER, ROLES.ADMIN, ROLES.PROVIDER), reviewController.getProviderReviews);
router.post('/:providerId/reviews', authorize(ROLES.USER), reviewController.addReview);

// Job Board
router.get('/jobs/all', authorize(ROLES.PROVIDER), jobController.getAllOpenJobs);
router.get('/jobs/direct', authorize(ROLES.PROVIDER), jobController.getDirectJobs);

export default router;