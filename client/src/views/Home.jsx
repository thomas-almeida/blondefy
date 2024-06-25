export default function Home() {
    return (
        <>
            <div className="bg-[#1E1E1E] text-white h-[100vh] p-5">

                <div className="flex items-center">
                    <span>
                        <img className="w-[70px] rounded-full" src="/default.webp" alt="" />
                    </span>
                    <span className="m-4">
                        <h1 className="text-2xl mb-1">Username</h1>
                        <b>FREE</b>
                    </span>
                </div>

                <div className="my-5">
                    <div className="uk-margin">
                        <input
                            className="uk-input text-white text-lg"
                            type="text"
                            placeholder="Pesquisar Músicas"
                            aria-label="search"
                        />
                    </div>
                </div>

                <div className="border h-[75vh] mb-2">

                </div>

                <div className="flex w-full">
                    <span>
                        <img className="w-[80px] border" src="/default-music.png" alt="" />
                    </span>
                    <span className="px-4 w-[250px]">
                        <h1 className="text-xl">Music Name</h1>
                        <b className="text-lg">Artist</b>
                    </span>
                    <div className="flex py-2">
                        <div className="cursor-pointer rounded-sm text-2xl uk-text-bold border w-[70px] text-center flex items-center justify-center mx-2">
                            +
                        </div>
                        <div className="cursor-pointer rounded-sm text-2xl uk-text-bold border w-[70px] text-center flex items-center justify-center mx-2">
                            {">"}
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}