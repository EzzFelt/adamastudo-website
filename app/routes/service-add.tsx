import type { Route } from "./+types/service-add";
import AddService from "../pages/Service/AddService";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Adicionar Serviço - AdamasTudo" },
  ];
}

export default function AddServiceRoute() {
  return <AddService />;
}