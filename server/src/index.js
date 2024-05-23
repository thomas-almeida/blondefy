const express = require('express')
const cors = require('cors')
const yt = require('yt-search')
const ytdl = require('ytdl-core')
const path = require('path')
const fs = require('fs')

const api = express()
const tempDir = path.join(__dirname, 'temp')

api.use(express.json())
api.use(cors())

api.get('/hello', async (req, res) => {
    return res.status(200).json({
        message: 'hello'
    })
})

api.get('/search/:theme', async (req, res) => {

    try {

        const theme = req.params.theme.replace(/-/g, ' ')
        const foundedResults = await yt(theme)

        let hqMusicResults = []

        foundedResults.all.forEach(result => {
            if (result.type === 'video') {
                hqMusicResults.push(result)
            }
        })

        res.status(200).json({
            message: 'success',
            data: hqMusicResults
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'internal server error'
        })
    }

})

api.post('/music/download-song', async (req, res) => {

    try {

        const videoUrl = req.body.url
        const musicName = req.body.name

        const filePath = path.join(tempDir, `${musicName}.mp3`)
        const audioStream = ytdl(videoUrl, { filter: 'audioonly' })
        audioStream.pipe(fs.createWriteStream(filePath))

        audioStream.on('end', () => {
            console.log('download concluído')
            res.status(200).json({
                message: 'Download concluído com sucesso',
                filePath: filePath
            })
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'internal server error'
        })
    }

})

api.listen('3333', () => {
    console.log('ship on the sea 🦜🏴‍☠️')
})