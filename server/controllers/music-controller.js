import ytdl from '@distube/ytdl-core'
import yt from 'yt-search'

async function searchSong(req, res) {

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

}

async function getStreamUrl(req, res) {
    try {
        const { videoId } = req.body
        const videoInfo = await ytdl.getInfo(videoId)
        const audioFormats = ytdl.filterFormats(videoInfo.formats, 'audioonly')

        if (audioFormats.length > 0) {

            const audioUrl = audioFormats[0].url
            res.status(200).json({ audioUrl })
        } else {
            res.status(404).json({ error: "Nenhum formato de áudio encontrado." })
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error..' })
        console.error(error)
    }
}

export default {
    searchSong,
    getStreamUrl
}