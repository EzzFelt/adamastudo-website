import { Navbar } from "~/components/NavBar/NavBar"
import { Table } from "~/components/JobsTable/Table"
import { Footer } from "~/components/Footer/Footer"

export const Cronogram = () => {
    return(
        <div className="w-full min-h-screen bg-gray-50 flex flex-col justify-between">
            <Navbar />
            <main className="px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Serviços</h1>
                    
                    {/* Days of week navigation */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <ul className="flex flex-row justify-evenly items-center py-4 px-2">
                            <li className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition-colors px-2 py-1 rounded">
                                Domingo
                            </li>
                            <li className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition-colors px-2 py-1 rounded">
                                Segunda
                            </li>
                            <li className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition-colors px-2 py-1 rounded">
                                Terça
                            </li>
                            <li className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition-colors px-2 py-1 rounded">
                                Quarta
                            </li>
                            <li className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition-colors px-2 py-1 rounded">
                                Quinta
                            </li>
                            <li className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition-colors px-2 py-1 rounded">
                                Sexta
                            </li>
                            <li className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition-colors px-2 py-1 rounded">
                                Sábado
                            </li>
                        </ul>
                    </div>
                    
                    {/* Table container with better spacing */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <Table />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}