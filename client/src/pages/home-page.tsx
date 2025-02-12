import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Recipe } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Clock, Search, User, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [_, setLocation] = useLocation();

  const { data: recipes = [], isLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
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
        {/* Hero Section with Search */}
        <div className="bg-gradient-to-b from-muted/50 to-background py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <h2 className="text-4xl font-bold mb-4">
                Discover Amazing Recipes
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Find the perfect recipe for any occasion
              </p>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search recipes..."
                  className="pl-10 h-12 text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe) => (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {recipe.dietaryRestrictions && recipe.dietaryRestrictions.length > 0 && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
                            {recipe.dietaryRestrictions[0]}
                          </div>
                        </div>
                      )}
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
                          {recipe.cuisine}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}