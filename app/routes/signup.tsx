
import SignUp from "~/pages/SignUp/SignUp";

export function meta() {
  return [
    { title: "Login - AdamasTurbo" },
    { name: "description", content: "Faça login na sua conta" },
  ];
}

export default function SignUpRoute() {
  return <SignUp />;
}
