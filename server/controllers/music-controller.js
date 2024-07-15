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
        const { videoId } = req.body // Obtém o videoUrl do corpo da requisição
        const videoInfo = await ytdl.getInfo(videoId)
        const audioFormats = ytdl.filterFormats(videoInfo.formats, 'audioonly')

        if (audioFormats.length > 0) {
            // Verifica se há formatos de áudio disponíveis
            const audioUrl = audioFormats[0].url // Pega o primeiro formato de áudio
            res.status(200).json({ audioUrl }) // Retorna o URL do áudio como resposta
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