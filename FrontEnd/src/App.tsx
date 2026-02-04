import { AppRoutes } from "./routes/AppRoutes";
import { Navbar } from "./components/Navbar";

export function App() {
  return (
    <>
      <Navbar />
      <AppRoutes />
    </>
  );
}
