import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import RecipePage from "@/pages/recipe-page";
import SavedRecipesPage from "@/pages/saved-recipes-page";
import ProfilePage from "@/pages/profile-page";
import CreateRecipePage from "@/pages/create-recipe-page";
import { ProtectedRoute } from "./lib/protected-route";
import { Navigation } from "@/components/navigation";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/">
        <>
          <Navigation />
          <HomePage />
        </>
      </Route>
      <Route path="/saved">
        <>
          <Navigation />
          <ProtectedRoute path="/saved" component={SavedRecipesPage} />
        </>
      </Route>
      <Route path="/profile">
        <>
          <Navigation />
          <ProtectedRoute path="/profile" component={ProfilePage} />
        </>
      </Route>
      <Route path="/create">
        <>
          <Navigation />
          <ProtectedRoute path="/create" component={CreateRecipePage} />
        </>
      </Route>
      <Route path="/recipes/:id">
        <>
          <Navigation />
          <ProtectedRoute path="/recipes/:id" component={RecipePage} />
        </>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Initialize theme from localStorage
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
