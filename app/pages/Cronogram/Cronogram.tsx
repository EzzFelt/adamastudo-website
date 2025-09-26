import { Navbar } from "~/components/NavBar/NavBar"
import { Table } from "~/components/JobsTable/Table"


export const Cronogram = () => {
    return(
        <div className="w-full min-h-screen">
            <Navbar />
            <main className="flex flex-col justify-center items-center px-6" style={{ minHeight: 'calc(100vh - 100px)' }}>
            <h1 className="text-2xl font-bold">Serviços</h1>
                <ul className="flex flex-row justify-evenly gap-4 mt-4 w-full">
                    <li>Domingo</li>
                    <li>Segunda</li>
                    <li>Terça</li>
                    <li>Quarta</li>
                    <li>Quinta</li>
                    <li>Sexta</li>
                    <li>Sábado</li>
                </ul>
                <Table />
            </main>
        </div>
    )
}