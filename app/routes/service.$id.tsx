import type { Route } from "./+types/service.$id";
import ServiceDetail from "../pages/Service/ServiceDetail";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Detalhes do Serviço - AdamasTudo" },
  ];
}

export default function ServiceDetailRoute() {
  return <ServiceDetail />;
}