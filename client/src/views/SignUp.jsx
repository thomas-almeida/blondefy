
import { useState } from "react"
import axios from "axios"
import chimpers from "../store/chimpers"
import { useNavigate } from "react-router-dom"

export default function SignUp() {

    const chimpersList = chimpers
    const redirect = useNavigate()
    const [userName, setUsername] = useState('')
    const [userEmail, setUseremail] = useState('')
    const [userPassword, setUserpassword] = useState('')
    const vpsEndpoint = 'https://workable-sloth-strangely.ngrok-free.app'

    async function registerUser(e) {
        e.preventDefault()

        if (userName === '' || !userEmail.includes('@') === true || userPassword === '') {
            alert('Preecha todos os campos, o email deve conter @')
            return
        }

        const payload = {
            name: userName,
            email: userEmail,
            password: userPassword,
            profilePic: chimpersList[Math.floor(Math.random() * 10)]
        }

        try {

            const response = await axios.post(`${vpsEndpoint}/users/sign-up`, payload, {
                headers: {
                    'ngrok-skip-browser-warning': '69420',
                    'Access-Control-Allow-Origin': '*',
                }
            })

            if (response.status === 409) {
                alert('Nome de Usuário ou Email já existentes')
                return
            }

            const userId = response.data.data?.id
            redirect(`/?id=${userId}`)
            localStorage.setItem('user-logged', true)

        } catch (error) {
            console.error(error)
        }

    }

    return (
        <div className="flex items-center justify-center h-[90vh]">
            <div className="w-[80%] p-2 text-center">
                <b className="text-green-500 text-sm">FREEMIUM</b>
                <br />
                <b className="text-gray-300 text-sm">MUSICA DE GRAÇA, SEM ANUNCIOS</b>

                <div className="my-4 py-8">
                    <form>

                        <input
                            className="uk-input border rounded-sm text-white text-lg py-[20px] font-bold placeholder:font-bold w-[100%] mb-4"
                            type="text"
                            value={userName}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nome de Usuário"
                            required
                        />
                        <input
                            className="uk-input border rounded-sm text-white text-lg py-[20px] font-bold placeholder:font-bold w-[100%] mb-4"
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUseremail(e.target.value)}
                            placeholder="Seu Melhor Email"
                            required
                        />
                        <input
                            className="uk-input border rounded-sm text-white text-lg py-[20px] font-bold placeholder:font-bold w-[100%] mb-4"
                            type="password"
                            value={userPassword}
                            onChange={(e) => setUserpassword(e.target.value)}
                            placeholder="Sua Senha"
                            required
                        />

                        <input
                            type="submit"
                            value="Cadastre-se"
                            className="w-[100%] rounded-sm bg-white text-black text-lg font-semibold p-2 cursor-pointer"
                            onClick={registerUser}
                        />

                    </form>
                </div>
            </div>
        </div>
    )
}