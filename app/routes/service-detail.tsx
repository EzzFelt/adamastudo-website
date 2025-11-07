import type { Route } from "./+types/service-detail";
import ServiceDetail from "../pages/Service/ServiceDetail";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Detalhes do Serviço - AdamasTudo" },
  ];
}

export default function ServiceDetailRoute() {
  return <ServiceDetail />;
}