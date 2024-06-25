import axios from 'axios'
import { useEffect, useState } from 'react'
import IonIcon from '../components/IonIcon'

export default function Home() {
    const [inputValue, setInputValue] = useState('')
    const [searchValues, setSearchValues] = useState([])
    const [currentSong, setCurrentSong] = useState('')
    const [isVisible, setIsVisible] = useState(false)
    const [isVisibleLikedSongs, setIsVisibleLikedSongs] = useState(true)
    const [isFetched, setFetched] = useState(false)
    const [isLiked, setLiked] = useState(false)
    const [likedSongs, setLikedSongs] = useState([])

    async function loadLikedSongs() {

        if (!localStorage.getItem('likedSongs')) {
            localStorage.setItem('likedSongs', [])
        }

        const likedSongsArr = JSON.parse(localStorage.getItem('likedSongs'))
        setLikedSongs(likedSongsArr)
    }

    useEffect(() => {
        loadLikedSongs()
    }, [])

    useEffect(() => {
        async function handleKeyPress(event) {
            if (event.key === 'Enter') {
                try {
                    const response = await axios.get(`https://blondefy.onrender.com/search/${inputValue}`)
                    setSearchValues(response.data.data)
                    setFetched(true)
                    setIsVisibleLikedSongs(false)
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

        setLiked(false)

        try {
            const response = await axios.post('https://blondefy.onrender.com/get-stream-url', {
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

    async function getLikedSong(song) {
        setCurrentSong({
            info: song?.info,
            audio: song?.audio
        })

        setIsVisible(true)
        setLiked(true)
    }

    function likeSong(songInfo) {

        let updatedLikedSongs

        if (isLiked) {
            setLiked(false)
            updatedLikedSongs = likedSongs.filter(song => song.videoId !== songInfo.info.videoId);
            setLikedSongs(updatedLikedSongs);
        } else {
            setLiked(true)
            console.log(songInfo)
            updatedLikedSongs = [...likedSongs, songInfo];
            setLikedSongs(updatedLikedSongs);
        }

        localStorage.setItem('likedSongs', JSON.stringify(updatedLikedSongs));
    }

    function toggleToLikedSongs() {
        if (isVisibleLikedSongs) {
            setIsVisibleLikedSongs(false)
            setFetched(true)
        } else {
            setIsVisibleLikedSongs(true)
            setFetched(false)
        }
    }

    return (
        <>
            <div className="bg-[#1E1E1E] text-white p-5">
                <div className="flex items-center">
                    <span>
                        <img className="w-[50px] h-[50px] rounded-full object-cover" src="/default.webp" alt="" />
                    </span>
                    <span className="mx-4 w-[250px]">
                        <h1 className="text-2xl font-semibold">FREEMIUM USER</h1>
                        <b className="text-sm text-gray-400">FREE</b>
                    </span>
                    <span
                        className='text-2xl p-2 border flex items-center rounded-sm bg-[#cccccc14]'
                        onClick={() => toggleToLikedSongs()}
                    >
                        <IonIcon size="large" name="albums" />
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
                <div className={`overflow-y-scroll mb-2 ${isVisible ? 'h-[62vh]' : 'h-[100vh]'} ${isFetched ? 'uk-display-block h-[62vh]' : 'hidden h-[100vh]'}`}>

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
                                <h2 className="whitespace-nowrap text-ellipsis overflow-hidden w-[250px] font-bold">{result.title}</h2>
                                <p>{result.author.name}</p>
                            </span>
                        </div>
                    ))}
                </div>

                <h2 className="px-2 my-1 font-semibold">{isVisibleLikedSongs ? 'Minhas Músicas' : ''}</h2>
                <div className={`overflow-y-scroll mb-2 ${isVisibleLikedSongs ? 'uk-display-block h-[62vh]' : 'hidden h-[100vh]'}`}>

                    {likedSongs.map((song) => (

                        <div
                            key={song?.info?.videoId}
                            onClick={() => getLikedSong(song)}
                            className="m-2 mx-2 p-2 cursor-pointer rounded-md flex items-center"
                        >
                            <span className="mr-4">
                                <img
                                    src={song?.info?.image}
                                    className="max-w-14 h-14 object-cover rounded-sm uk-box-shadow-large"
                                    alt=""
                                />
                            </span>
                            <span>
                                <h2 className="whitespace-nowrap text-ellipsis overflow-hidden w-[250px] font-bold">{song?.info?.title}</h2>
                                <p>{song?.info?.author?.name}</p>
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
                            <h1 className="text-xlg whitespace-nowrap text-ellipsis overflow-hidden w-[190px] font-bold">{currentSong?.info?.title}</h1>
                            <p className="text-sm whitespace-nowrap text-ellipsis overflow-hidden">{currentSong?.info?.author.name}</p>
                        </span>
                        <span
                            className="px-4 w-[100px] flex items-center cursor-pointer"
                            onClick={() => likeSong(currentSong)}
                        >
                            <IonIcon size="large" name={isLiked ? 'heart' : 'heart-outline'} />
                        </span>
                    </div>

                    <audio src={currentSong?.audio} className="w-[100%] h-[30px]" controls autoPlay></audio>
                </div>

            </div>
        </>
    )
}
