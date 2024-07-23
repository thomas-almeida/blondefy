import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { NavLink } from "react-router-dom"

export default function SignIn() {

    const [userEmail, setUseremail] = useState('')
    const [userPassword, setUserpassword] = useState('')
    const vpsEndpoint = 'https://workable-sloth-strangely.ngrok-free.app'
    const redirect = useNavigate()

    async function loginUser(e) {
        e.preventDefault()

        if (!userEmail.includes('@') || userPassword === '') {
            alert('Insira todos os campos')
            return
        }

        const payload = {
            email: userEmail,
            password: userPassword
        }

        try {
            const response = await axios.post(`${vpsEndpoint}/users/sign-in`, payload, {
                headers: {
                    'ngrok-skip-browser-warning': '69420',
                    'Access-Control-Allow-Origin': '*',
                }
            })
            console.log(response.status)

            if (response.status === 401) {
                alert('email ou senha incorretos')
            }

            const userId = response.data?.user?.id
            localStorage.setItem('user-logged', true)
            redirect(`/?id=${userId}`)

        } catch (error) {
            alert(error?.message)
            console.log(error)
        }

    }

    return (
        <div className="flex items-center justify-center h-[90vh]">
            <div className="w-[80%] p-2 text-center">
                <b className="text-green-500 text-sm">FREEMIUM</b>
                <br />
                <b className="text-gray-300 text-sm">MUSICA DE GRAÇA, SEM ANUNCIOS</b>

                <div className="my-2 py-8">
                    <form action="">

                        <input
                            className="uk-input border rounded-sm text-white text-lg py-[20px] font-bold placeholder:font-bold w-[100%] mb-4"
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUseremail(e.target.value)}
                            placeholder="Email"
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
                            value="Entrar"
                            className="w-[100%] rounded-sm bg-white text-black text-lg font-semibold p-2 cursor-pointer"
                            onClick={loginUser}
                        />

                        <NavLink to={`/sign-up`}>
                            <p className="mt-6 text-green-400 cursor-pointer">Ainda não tem conta?, cadastre-se!</p>
                        </NavLink>

                    </form>
                </div>
            </div>
        </div>
    )
}