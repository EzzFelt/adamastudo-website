import { Navbar } from "../../components/NavBar/NavBar"
import adamastorImg from "../../../public/adamastor.png"
import { ServiceCard } from "../../components/Card/ServiceCard"
import { Hammer, Lightbulb, ShowerHead } from "lucide-react";
import { FaqSection } from "~/components/FAQ/FaqSection";
import { Footer } from "~/components/Footer/Footer";


export function Welcome() {
  return(
     <>
       <Navbar />
       <main className="flex justify-between py-10 px-40">
        <div className="flex flex-col w-lg mt-35">
          <h1 className="text-4xl font-bold" >O melhor faz tudo da região</h1>
           <p>
            Entre em contato com o melhor faz
            tudo da região e encontre o serviço
            que você precisa com qualidade que
            você almeja.
           </p>
           <a className="text-center mt-5 bg-yellow-400 hover:text-amber-50 w-35 py-2 px-2.5 rounded-full" href="">Comece Agora!</a>
        </div>
        <img src={adamastorImg} className="mt-5" alt="" />
       </main>

       <section className="w-full flex flex-col items-center mt-20">
        <h2 className="text-2xl font-bold">Serviços Populares</h2>
        <h3 className="text-lg font-bold mt-5">Aqui estão um dos meus serviços com alta demanda!</h3>
        <h4 className="text-md font-bold">Cheque alguns deles</h4>
        <div className="grid grid-cols-3 gap-10 mt-10">
          <ServiceCard
            icon={<Lightbulb size={20} />}
            title="Eletricista"
            description="Serviços de instalação, reparo e manutenção elétrica para residências e empresas."
          />
          <ServiceCard
            icon={<ShowerHead size={20} />}
            title="Encanador"
            description="Serviços de instalação, reparo e manutenção de sistemas hidráulicos e sanitários."
          />
          <ServiceCard
            icon={<Hammer size={20} />}
            title="Marceneiro"
            description="Serviços de fabricação, reparo e instalação de móveis e estruturas de madeira."
          />
        </div>
        <FaqSection />
       </section>
       <Footer />
     </>
  );
}
  
  

