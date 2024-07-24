import { Router } from "express"
import musicController from "../controllers/music-controller.js"
import userController from "../controllers/user-controller.js"

const api = Router()

// songs
api.get('/search/:theme', musicController.searchSong)
api.post('/get-stream-url', musicController.getStreamUrl)

//User
api.post('/users/sign-up', userController.signUp)
api.post('/users/sign-in', userController.signIn)
api.get('/users/get-user-by-id/:id', userController.getUser)
api.post('/users/songs/like-song', userController.likeSong)

export default api