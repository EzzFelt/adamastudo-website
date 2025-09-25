import Logo from "../../../public/adamas_logo.png"


export function Navbar(){
    return(
        <>
         <div className="w-full flex justify-center">
            <nav className="w-7xl flex justify-between items-center mt-9">
                <div className="w-lg flex justify-evenly items-center">
                <img className="h-6" src={Logo} alt="Adamas Tudo Logo"/>
                <h3>Home</h3>
                <h3>Serviços</h3>
                </div>
                <h3>Entrar</h3>
            </nav>
         </div>
        </>
    )
}