import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Recipe } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Clock, Search, User, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const CUISINE_TYPES = [
  "All",
  "African",
  "European",
  "Indian",
  "Asian",
  "Mediterranean",
  "American",
  "Middle Eastern",
  "Caribbean",
  "Latin American"
];

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [_, setLocation] = useLocation();

  const { data: recipes = [], isLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCuisine = selectedCuisine === "All" || recipe.cuisine === selectedCuisine;

    if (!searchTerm.trim()) return matchesCuisine;

    const search = searchTerm.toLowerCase().trim();
    const searchableFields = [
      recipe.title,
      recipe.description,
      recipe.cuisine,
      ...(recipe.dietaryRestrictions || []),
      ...(recipe.ingredients || [])
    ].map(field => (field || "").toLowerCase());

    return matchesCuisine && searchableFields.some(field => field.includes(search));
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header remains unchanged */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                Recipe Hub
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user.username}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => logoutMutation.mutate()}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => setLocation("/auth")}>
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section with Search and Cuisine Filter */}
        <div className="bg-gradient-to-b from-muted/50 to-background py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <h2 className="text-4xl font-bold mb-4">
                Discover Amazing Recipes
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Explore diverse cuisines from around the world
              </p>
              <div className="space-y-4">
                <div className="relative max-w-xl mx-auto">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search recipes by title, ingredients, cuisine..."
                    className="pl-10 h-12 text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {CUISINE_TYPES.map((cuisine) => (
                    <Button
                      key={cuisine}
                      variant={selectedCuisine === cuisine ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCuisine(cuisine)}
                      className="min-w-[100px]"
                    >
                      {cuisine}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <p className="text-center col-span-full">Loading recipes...</p>
            ) : filteredRecipes.length === 0 ? (
              <p className="text-center col-span-full text-muted-foreground">
                No recipes found matching your search.
              </p>
            ) : (
              filteredRecipes.map((recipe) => (
                <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <div className="bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
                            {recipe.cuisine}
                          </div>
                          {recipe.dietaryRestrictions && recipe.dietaryRestrictions.length > 0 && (
                            <div className="bg-secondary/90 text-white text-xs px-2 py-1 rounded-full mt-1">
                              {recipe.dietaryRestrictions[0]}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-2 line-clamp-1">
                          {recipe.title}
                        </h2>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                          {recipe.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {recipe.prepTime + recipe.cookTime} mins
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {recipe.servings} servings
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}