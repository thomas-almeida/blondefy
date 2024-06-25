import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Home() {
    const [inputValue, setInputValue] = useState('')
    const [searchValues, setSearchValues] = useState([])
    const [currentSong, setCurrentSong] = useState('')
    const [isVisible, setIsVisible] = useState(false)
    const [isFetched, setFetched] = useState(false)

    useEffect(() => {
        async function handleKeyPress(event) {
            if (event.key === 'Enter') {
                try {
                    const response = await axios.get(`http://localhost:3000/search/${inputValue}`)
                    setSearchValues(response.data.data)
                    setFetched(true)
                } catch (error) {
                    console.error('Erro ao buscar dados:', error)
                }
            }
        }

        document.addEventListener('keydown', handleKeyPress)

        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [inputValue])

    async function getSong(songUrl, songInfos) {
        try {
            const response = await axios.post('http://localhost:3000/get-stream-url', {
                videoUrl: songUrl,
            })
            setCurrentSong({
                info: songInfos,
                audio: response.data.audioUrl
            })

            setIsVisible(true)
        } catch (error) {
            console.error('Erro ao enviar solicitação:', error)
        }
    }

    return (
        <>
            <div className="bg-[#1E1E1E] text-white p-5">
                <div className="flex items-center">
                    <span>
                        <img className="w-[50px] h-[50px] rounded-full object-cover" src="/default.webp" alt="" />
                    </span>
                    <span className="mx-4">
                        <h1 className="text-2xl">Username</h1>
                        <b>FREE</b>
                    </span>
                </div>

                <div className="my-5">
                    <div className="uk-margin">
                        <input
                            className="uk-input border-2 text-white text-lg py-[20px] font-bold placeholder:font-bold"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="O que voce quer ouvir ?"
                            aria-label="search"
                        />
                    </div>
                </div>

                <h2 className='px-2 my-1 font-semibold'>{isFetched ? `Resultados` : ''}</h2>
                <div className={`overflow-y-scroll mb-2 ${isVisible ? 'h-[62vh]' : 'h-[100vh]'}`}>

                    {searchValues.map((result) => (

                        <div
                            key={result.videoId}
                            onClick={() => getSong(result.url, result)}
                            className="m-2 mx-2 p-2 cursor-pointer rounded-md flex items-center"
                        >
                            <span className="mr-4">
                                <img
                                    src={result.image}
                                    className="max-w-14 h-14 object-cover rounded-sm uk-box-shadow-large"
                                    alt=""
                                />
                            </span>
                            <span>
                                <h2 className="whitespace-nowrap text-ellipsis overflow-hidden w-[250px]">{result.title}</h2>
                                <b>{result.author.name}</b>
                            </span>
                        </div>
                    ))}
                </div>

                <div className={`w-[90%] uk-position-fixed bottom-4 rounded-sm bg-[#f1f3f4] text-slate-900 uk-box-shadow-xlarge ${isVisible ? 'uk-display-block' : 'hidden'}`}>
                    <div className="flex m-2 pb-2">
                        <span>
                            <img className="max-w-14 h-14 object-cover rounded-sm uk-box-shadow-xlarge" src={currentSong?.info?.image} alt="" />
                        </span>
                        <span className="px-4">
                            <h1 className="text-xlg whitespace-nowrap text-ellipsis overflow-hidden w-[250px]">{currentSong?.info?.title}</h1>
                            <b className="text-sm">{currentSong?.info?.author.name}</b>
                        </span>
                    </div>

                    <audio src={currentSong?.audio} className="w-[100%] h-[30px]" controls autoPlay></audio>
                </div>

            </div>
        </>
    )
}
