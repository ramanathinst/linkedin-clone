import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getSuggestionsConnections, getPublicProfile, updateProfile } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/suggestions" , protectRoute , getSuggestionsConnections );
router.get("/:username" , protectRoute , getPublicProfile );
router.put("/profile" , protectRoute , updateProfile );


export default router