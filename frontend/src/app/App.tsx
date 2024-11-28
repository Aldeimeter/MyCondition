import { AuthProvider } from "@/features/auth";
import { AppRouter } from "@/app/providers";
import { BrowserRouter } from "react-router-dom";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
