import uuid from '../scripts/uuid.js'
import cript from '../scripts/encript.js'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '..', 'db', 'users.json')

async function signUp(req, res) {
    let users = []

    try {
        const { name, email, password, picture } = req.body


        if (!fs.existsSync(dbPath)) {
            fs.writeFileSync(dbPath, '[]')
        }

        if (fs.existsSync(dbPath)) {
            const data = fs.readFileSync(dbPath, 'utf-8')
            users = data ? JSON.parse(data) : []
        }

        const userExist = users.some(user => user.name === name || user.email === email)

        if (userExist) {
            return res.status(409).json({ message: 'username or email alredy exist' })
        }

        let encriptedPassword = cript.encrypt(password)

        const id = uuid.generateExtenseId(users)
        const newUser = {
            id,
            name,
            email,
            password: encriptedPassword,
            likedSongs: [],
            picture
        }

        users.push(newUser)
        fs.writeFileSync(dbPath, JSON.stringify(users, null, 2))
        return res.status(200).json({
            message: 'success',
            data: newUser
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'internal server error' })
    }
}


async function signIn(req, res) {
    let users = []

    try {
        const { email, password } = req.body

        if (fs.existsSync(dbPath)) {
            const data = fs.readFileSync(dbPath, 'utf-8')
            users = data ? JSON.parse(data) : []
        }

        let encriptedPassword = cript.encrypt(password)

        const userRegistered = users.find(user => user.email === email && user.password === encriptedPassword)

        if (userRegistered) {
            console.log(`user [${userRegistered.id}]${userRegistered.name} has logged in`)
            return res.status(200).json({
                message: 'success',
                user: userRegistered
            })
        } else {
            return res.status(401).json({ message: 'username or password do not match' })
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'internal server error' })
    }
}


async function getUser(req, res) {

    try {
        const id = req.params.id
        let users = []

        const data = fs.readFileSync(dbPath, 'utf-8')
        users = data ? JSON.parse(data) : []

        const userExist = users.some(user => user.id === id)

        if (!userExist) {
            res.status(401).json({ message: 'user not found' })
        }

        const user = users.find(user => user.id === id)
        return res.status(200).json({
            message: 'success',
            user: user
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'internal server error' })
    }

}

async function likeSong(req, res) {

    try {

        let users = []
        const { userId, song } = req.body
        const data = fs.readFileSync(dbPath, 'utf-8')
        users = data ? JSON.parse(data) : []

        const userExist = users.some(user => user.id === userId)

        if (!userExist) {
            res.status(409).json({ message: 'user not found' })
        }

        users.forEach((user, index) => {
            if (users[index].id === userId) {
                users[index]?.likedSongs?.push(song)
                fs.writeFileSync(dbPath, JSON.stringify(users), null, 2)
                return res.json({
                    message: 'success',
                    song: song
                })
            }
        })

    } catch (error) {
        console.error(error)
        res.json({ message: 'Internal server error' })
    }

}


export default {
    signIn,
    signUp,
    getUser,
    likeSong
}