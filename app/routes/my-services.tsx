import type { Route } from "./+types/my-services";
import MyServices from "../pages/MyServices/MyServices";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Meus Agendamentos - AdamasTudo" },
  ];
}

export default function MyServicesRoute() {
  return <MyServices />;
}