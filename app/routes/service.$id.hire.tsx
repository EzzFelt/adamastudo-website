import type { Route } from "./+types/service.$id.hire";
import HireService from "../pages/Service/HireService";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contratar Serviço - AdamasTudo" },
  ];
}

export default function HireServiceRoute() {
  return <HireService />;
}