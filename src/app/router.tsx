import { createBrowserRouter } from "react-router-dom";
import HomePage from "../modules/home";
import LoginPage from "../modules/auth/pages/login";
import RegisterPage from "../modules/auth/pages/register";
import App from "./App";
import VerifyEmailPage from "../modules/auth/pages/confirmation";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmailPage />,
      },
    ],
  },
]);

export default router;
