/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios'
import { useEffect, useState } from 'react'
import IonIcon from '../components/IonIcon'
import { useNavigate } from 'react-router-dom'

export default function Home() {

    const [inputValue, setInputValue] = useState('')
    const [searchValues, setSearchValues] = useState([])
    const [currentSong, setCurrentSong] = useState('')
    const [isVisible, setIsVisible] = useState(false)
    const [isVisibleLikedSongs, setIsVisibleLikedSongs] = useState(true)
    const [isFetched, setFetched] = useState(false)
    const [isLiked, setLiked] = useState(false)
    const [likedSongs, setLikedSongs] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [user, setUser] = useState({})
    const params = new URLSearchParams(window.location.search)
    const userId = params.get('id')

    const vpsEndpoint = 'https://workable-sloth-strangely.ngrok-free.app'
    const redirect = useNavigate()
    const userLogged = localStorage.getItem('user-logged')

    async function loadLikedSongs() {

        if (!localStorage.getItem('likedSongs')) {
            localStorage.setItem('likedSongs', [])
        }

        const likedSongsArr = JSON.parse(localStorage.getItem('likedSongs'))
        setLikedSongs(likedSongsArr)
    }

    useEffect(() => {

        console.log(params.get('id'))

        if (userLogged === 'false') {
            redirect('/')
        } else {
            getUser()
        }

    }, [])

    useEffect(() => {
        loadLikedSongs()
    }, [])

    useEffect(() => {
        async function handleKeyPress(event) {
            if (event.key === 'Enter') {
                searchSong()
            }
        }

        document.addEventListener('keydown', handleKeyPress)

        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (isLoading) {
            const timeoutId = setTimeout(() => {
                setLoading(false)
            }, 3000)

            return () => clearTimeout(timeoutId)
        }
    }, [isLoading])


    async function getUser() {

        try {

            const response = await axios.get(`${vpsEndpoint}/users/get-user-by-id/${userId}`,
                {
                    headers: {
                        'ngrok-skip-browser-warning': '69420',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            )

            setUser(response.data?.user)
            localStorage.setItem('userData', user)

        } catch (error) {
            console.error(error)
        }
    }

    async function searchSong() {
        try {
            const response = await axios.get(`${vpsEndpoint}/search/${inputValue}`, {
                headers: {
                    'ngrok-skip-browser-warning': '69420',
                    'Access-Control-Allow-Origin': '*',
                }
            })

            setSearchValues(response.data.data)
            setLoading(true)

            if (response.data.data) {
                setIsVisibleLikedSongs(false)
                setFetched(true)
            }



        } catch (error) {
            console.error('Erro ao buscar dados:', error)
        }
    }

    async function getSong(songId, songInfos) {

        setLiked(false)

        try {
            const response = await axios.post(`${vpsEndpoint}/get-stream-url`, {
                videoId: songId,
            }, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'ngrok-skip-browser-warning': '69420'
                }
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

        try {

            const response = await axios.post(`${vpsEndpoint}/get-stream-url`, {
                videoId: song?.info?.videoId
            })

            setCurrentSong({
                info: song?.info,
                audio: response.data?.audioUrl
            })

            setIsVisible(true)
            setLiked(true)

        } catch (error) {
            console.error(error)
            alert(error)
        }
    }


    async function likeSong(songInfo) {

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

        try {

            const response = await axios.post(`${vpsEndpoint}/users/songs/like-song`, {
                userId: user.id,
                song: songInfo
            })

            console.log(response.data)

        } catch (error) {
            console.error(error)
        }



        localStorage.setItem('likedSongs', JSON.stringify(updatedLikedSongs));
    }

    function toogleLikedSongs() {

        if (isVisibleLikedSongs === false) {
            setIsVisibleLikedSongs(true)
            getUser()
            setFetched(false)
        }
    }

    function toogleSearchResults() {

        if (isFetched === false) {
            setIsVisibleLikedSongs(false)
            setFetched(true)
        }
    }



    return (
        <>
            <div className="p-5">
                <div className="flex items-center">
                    <span>
                        <img
                            className="w-[50px] h-[50px] rounded-full object-cover"
                            src={user?.picture}
                        />
                    </span>
                    <span className="mx-4 w-[250px]">
                        <h1 className="text-2xl font-semibold">{user?.name}</h1>
                        <b className="text-sm text-green-400 p-1">FREE FOREVER</b>
                    </span>
                </div>

                <div className="my-5">
                    <div className="uk-margin mb-2 flex items-center">
                        <input
                            className="uk-input border rounded-sm text-white text-lg py-[25px] font-bold placeholder:font-medium"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="O que voce quer ouvir ?"
                            aria-label="search"
                        />
                        <div
                            className='absolute right-7 w-[80px] text-xl rounded-sm p-2 py-[10px] bg-green-400 text-black flex items-center justify-center cursor-pointer'
                            onClick={() => searchSong()}
                        >
                            <IonIcon name="search" />
                        </div>
                    </div>

                    <div>
                        <img
                            className={`${isLoading ? 'block' : 'hidden'}`}
                            src="https://i.pinimg.com/originals/e2/63/00/e26300c0c746d3163a0f48223c897cee.gif" alt="" />
                    </div>
                </div>

                <div className='lg:flex justify-around'>
                    <div className='flex mb-4 lg:block'>
                        <h2
                            className="p-2 my-1 font-semibold border-2 border-[#ffffff5b] mr-2 rounded-sm flex items-center cursor-pointer hover:border-green-500 lg:mb-2"
                            onClick={() => toogleLikedSongs()}
                        >
                            <IonIcon name="heart" />
                            <p className='ml-1'>Minhas Músicas</p>
                        </h2>
                        <h2
                            className='p-2 my-1 font-semibold border-2 border-[#ffffff5b] mr-2 rounded-sm flex items-center cursor-pointer hover:border-green-500'
                            onClick={() => toogleSearchResults()}
                        >
                            <IonIcon name="search" />
                            <p className='ml-1'>Resultados da Busca</p>
                        </h2>
                    </div>
                    <div className={`overflow-y-scroll mb-2 ${isVisible ? 'h-[55vh]' : 'h-[100vh]'} ${isFetched ? 'uk-display-block h-[62vh]' : 'hidden h-[100vh]'} lg:w-[80%]`}>

                        {searchValues.map((result) => (

                            <div
                                key={result.videoId}
                                onClick={() => getSong(result.videoId, result)}
                                className="m-2 mx-2 p-2 cursor-pointer rounded-md flex items-center"
                            >
                                <span className="mr-4">
                                    <img
                                        src={result.image}
                                        className="max-w-12 h-12 object-cover rounded-sm uk-box-shadow-large"
                                        alt=""
                                    />
                                </span>
                                <span>

                                    <h2 className="whitespace-nowrap text-ellipsis overflow-hidden w-[250px] font-semibold text-[11pt]">{result.title}</h2>
                                    <div className='flex items-center'>
                                        <div className={`flex items-center ${result.title === currentSong?.info?.title ? 'block' : 'hidden'} text-green-400`}>
                                            <div className='flex items-center text-[7pt]'>
                                                <IonIcon name="ellipse" />
                                            </div>
                                            <p className='mr-2 ml-[2px] font-semibold whitespace-nowrap text-[10pt]'>
                                                Tocando Agora
                                            </p>
                                        </div>
                                        <p className='whitespace-nowrap text-ellipsis overflow-hidden text-[10pt] font-light'>{result.author?.name}</p>
                                    </div>
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className={`overflow-y-scroll mb-2 ${isVisibleLikedSongs ? 'uk-display-block' : 'hidden h-[100vh]'} ${isVisible ? `h-[55vh]` : ''} lg:w-[80%]`}>

                        {user?.likedSongs?.map((song) => (

                            <div
                                key={song?.info?.videoId}
                                onClick={() => getLikedSong(song)}
                                className="m-2 mx-2 p-2 cursor-pointer rounded-md flex items-center"
                            >
                                <span className="mr-4">
                                    <img
                                        src={song?.info?.image}
                                        className="max-w-12 h-12 object-cover rounded-sm uk-box-shadow-large"
                                        alt=""
                                    />
                                </span>
                                <span>
                                    <h2 className="whitespace-nowrap text-ellipsis overflow-hidden w-[250px] font-semibold">{song?.info?.title}</h2>
                                    <div className='flex items-center'>
                                        <div className={`flex items-center ${song?.info?.title === currentSong?.info?.title ? 'block' : 'hidden'} text-green-400`}>
                                            <div className='flex items-center text-[7pt]'>
                                                <IonIcon name="ellipse" />
                                            </div>
                                            <p className='mr-2 ml-[2px] font-semibold whitespace-nowrap text-[10pt]'>
                                                Tocando Agora
                                            </p>
                                        </div>
                                        <p className='whitespace-nowrap text-ellipsis overflow-hidden text-[11pt]'>{song?.info?.author?.name}</p>
                                    </div>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`w-auto uk-position-fixed bottom-4 rounded-sm bg-[#f1f3f4] text-slate-900 uk-box-shadow-xlarge ${isVisible ? 'block' : 'hidden'} lg:w-[95%] lg:flex lg:items-center justify-center`}>
                    <div className="flex justify-around m-2 pb-2">
                        <span>
                            <img className="max-w-14 h-14 object-cover rounded-sm uk-box-shadow-xlarge" src={currentSong?.info?.image} alt="" />
                        </span>
                        <span className="px-4">
                            <h1 className="text-xlg whitespace-nowrap text-ellipsis overflow-hidden w-[170px] font-bold">{currentSong?.info?.title}</h1>
                            <p className="text-sm whitespace-nowrap text-ellipsis overflow-hidden">{currentSong?.info?.author.name}</p>
                        </span>
                        <span
                            className="px-4 w-[100px] flex items-center cursor-pointer"
                            onClick={() => likeSong(currentSong)}
                        >
                            <IonIcon size="large" name={isLiked ? 'heart' : 'heart-outline'} />
                        </span>
                    </div>

                    <audio src={currentSong?.audio} className="w-[100%] h-[30px]" controls autoPlay loop></audio>
                </div>

            </div>
        </>
    )
}
