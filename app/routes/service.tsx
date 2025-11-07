import type { Route } from "./+types/service";
import ServiceList from "../pages/Service/ServiceList";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Serviços - AdamasTudo" },
    { name: "description", content: "Veja todos os serviços disponíveis" },
  ];
}

export default function ServiceRoute() {
  return <ServiceList />;
}