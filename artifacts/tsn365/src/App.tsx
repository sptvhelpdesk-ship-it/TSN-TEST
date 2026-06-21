import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { ToastContainer } from "@/components/Toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Live from "@/pages/Live";
import Upcoming from "@/pages/Upcoming";
import PredictionsPage from "@/pages/PredictionsPage";
import Highlights from "@/pages/Highlights";
import SportDetails from "@/pages/SportDetails";
import VideoPlayer from "@/pages/VideoPlayer";
import PredictionDetails from "@/pages/PredictionDetails";
import SportsChannel from "@/pages/SportsChannel";
import SportsPlayer from "@/pages/SportsPlayer";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sports/live" component={Live} />
      <Route path="/sports/upcoming" component={Upcoming} />
      <Route path="/sports/prediction" component={PredictionsPage} />
      <Route path="/sports/highlights" component={Highlights} />
      <Route path="/sports/channel" component={SportsChannel} />
      {/* Sports channel player: /sports/player/:slug — must come before /sports/:sport */}
      <Route path="/sports/player/:slug" component={SportsPlayer} />
      {/* Video player: /sports/live/:cat&:slug */}
      <Route path="/sports/live/:catslug" component={VideoPlayer} />
      {/* Prediction detail */}
      <Route path="/sports/prediction/:key" component={PredictionDetails} />
      {/* Sport detail page */}
      <Route path="/sports/:sport" component={SportDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <div className="flex flex-col min-h-screen bg-[#0B111A] text-white">
              <Header />
              <div className="flex-1">
                <Router />
              </div>
              <Footer />
            </div>
          </WouterRouter>
          <ToastContainer />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
