import Login from "../pages/Login/Login";

export function meta() {
  return [
    { title: "Login - AdamasTurbo" },
    { name: "description", content: "Faça login na sua conta" },
  ];
}

export default function LoginRoute() {
  return <Login />;
}
