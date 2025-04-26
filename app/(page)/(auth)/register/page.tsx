import { Suspense } from "react";
import RegisterForm from "./components/register-form";

export default function Page() {
  return (
    <Suspense fallback={<div>...Loading</div>}>
      <RegisterForm />
    </Suspense>
  );
}
