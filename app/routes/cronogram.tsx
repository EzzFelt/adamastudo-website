import type { Route } from "./+types/home";
import { Cronogram } from "../pages/Cronogram/Cronogram";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AdamasTurbo" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Cronogram />;
}

export function ErrorBoundary() {
  return <div>Ocorreu um erro {":("}</div>;
}

