import { Home } from "~/pages/home";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Wordle" },
    { name: "description", content: "A word guessing game" },
  ];
}

export default function Index() {
  return <Home />;
}
