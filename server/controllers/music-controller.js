import ytdl from '@distube/ytdl-core'
import { Cookie } from 'tough-cookie'
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
            const proxyUrl = 'http://186.215.87.194:6005'
            const requestOptions = {
                headers: {
                    headers: {
                        'Proxy-Authorization': 'Basic',
                      },
                      agent: false, // Desativa o agente padrão para usar o proxy
                      proxy: proxyUrl,
                }
            }

            const audioStream = ytdl(videoId, {
                requestOptions,
                quality: 'highestaudio'
            },)

            res.status(200).json({ audioUrl, audioStream })
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