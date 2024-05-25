import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainPage from ".";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="h-screen flex justify-center items-center">
        <MainPage />
      </main>
    </QueryClientProvider>
  );
}

export default App;
