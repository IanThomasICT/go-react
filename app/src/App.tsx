import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainPage from "./pages";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainPage />
    </QueryClientProvider>
  );
}

export default App;
