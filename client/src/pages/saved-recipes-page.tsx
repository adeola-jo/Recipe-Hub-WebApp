import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Recipe } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Clock, Heart, User, UtensilsCrossed } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Footer } from "@/components/footer";

export default function SavedRecipesPage() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();

  const { data: savedRecipes = [], isLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/saved-recipes"],
    enabled: !!user,
  });

  // Redirect if not logged in
  if (!user) {
    setLocation("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-muted/50 to-background py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Heart className="h-8 w-8 text-primary" fill="currentColor" />
              </div>
              <h1 className="text-4xl font-bold mb-4">
                Your Saved Recipes
              </h1>
              <p className="text-lg text-muted-foreground">
                {savedRecipes.length === 0
                  ? "Start saving your favorite recipes to build your personal collection"
                  : `You have ${savedRecipes.length} saved ${savedRecipes.length === 1 ? 'recipe' : 'recipes'}`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="text-center">
              <p className="text-muted-foreground">Loading your saved recipes...</p>
            </div>
          ) : savedRecipes.length === 0 ? (
            /* Empty State */
            <div className="max-w-md mx-auto text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                <UtensilsCrossed className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">No saved recipes yet</h2>
              <p className="text-muted-foreground mb-6">
                Explore our recipe collection and save your favorites to see them here.
              </p>
              <Button onClick={() => setLocation("/")}>
                Browse Recipes
              </Button>
            </div>
          ) : (
            /* Recipe Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedRecipes.map((recipe) => (
                <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.title}
                          className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2">
                          <div className="bg-primary/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            {recipe.cuisine}
                          </div>
                        </div>
                        <div className="absolute top-2 left-2">
                          <div className="bg-red-500/90 p-1.5 rounded-full backdrop-blur-sm">
                            <Heart className="h-3.5 w-3.5 text-white" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h2 className="text-lg font-semibold mb-2 line-clamp-1">
                          {recipe.title}
                        </h2>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                          {recipe.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {recipe.prepTime + recipe.cookTime}m
                          </div>
                          <div className="flex items-center">
                            <User className="h-3.5 w-3.5 mr-1" />
                            {recipe.servings}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
