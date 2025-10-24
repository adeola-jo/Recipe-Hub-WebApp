import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Recipe } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Clock, Search, User, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Footer } from "@/components/footer";

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

function RecipeCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <Skeleton className="w-full h-48 rounded-t-lg" />
        <div className="p-6 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");

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
          {!isLoading && filteredRecipes.length > 0 && (
            <div className="mb-6 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Showing {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              <>
                {Array.from({ length: 8 }).map((_, i) => (
                  <RecipeCardSkeleton key={i} />
                ))}
              </>
            ) : filteredRecipes.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                  <UtensilsCrossed className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold mb-3">No recipes found</h2>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || selectedCuisine !== "All"
                    ? "Try adjusting your search or filters"
                    : "Start by browsing our recipe collection"}
                </p>
                {(searchTerm || selectedCuisine !== "All") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCuisine("All");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              filteredRecipes.map((recipe) => (
                <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                  <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full">
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="relative overflow-hidden">
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.title}
                          className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-2 right-2">
                          <div className="bg-primary/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            {recipe.cuisine}
                          </div>
                        </div>
                        {recipe.dietaryRestrictions && recipe.dietaryRestrictions.length > 0 && (
                          <div className="absolute top-2 left-2">
                            <div className="bg-green-500/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                              {recipe.dietaryRestrictions[0]}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h2 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {recipe.title}
                        </h2>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                          {recipe.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
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
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}