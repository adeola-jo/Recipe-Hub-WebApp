import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Recipe } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Bookmark, BookmarkCheck, Clock, Loader2, Utensils, Users } from "lucide-react";
import { Link, useParams } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function RecipePage() {
  const { user } = useAuth();
  const { id } = useParams();
  const { toast } = useToast();
  const recipeId = id ? parseInt(id) : undefined;

  const { data: recipe, isLoading: isLoadingRecipe } = useQuery<Recipe>({
    queryKey: ["/api/recipes", recipeId],
    queryFn: async () => {
      const response = await fetch(`/api/recipes/${recipeId}`);
      if (!response.ok) {
        throw new Error('Recipe not found');
      }
      return response.json();
    },
    enabled: !!recipeId,
  });

  const { data: savedRecipes = [], isLoading: isLoadingSaved } = useQuery<Recipe[]>({
    queryKey: ["/api/saved-recipes"],
    enabled: !!user,
  });

  const isSaved = savedRecipes.some((r) => r.id === recipeId);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!recipeId) throw new Error("Recipe ID is required");
      const res = await apiRequest("POST", `/api/saved-recipes/${recipeId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-recipes"] });
      toast({
        title: "Recipe saved",
        description: "This recipe has been added to your saved recipes.",
      });
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: async () => {
      if (!recipeId) throw new Error("Recipe ID is required");
      await apiRequest("DELETE", `/api/saved-recipes/${recipeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-recipes"] });
      toast({
        title: "Recipe removed",
        description: "This recipe has been removed from your saved recipes.",
      });
    },
  });

  if (isLoadingRecipe) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (!recipe || !recipeId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold text-center mb-4">Recipe Not Found</h1>
            <Link href="/" className="block text-center text-primary hover:underline">
              Return to Home
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recipes
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
              <p className="text-muted-foreground">{recipe.description}</p>
            </div>
            {user && (
              <Button
                variant={isSaved ? "outline" : "default"}
                size="lg"
                onClick={() => {
                  if (isSaved) {
                    unsaveMutation.mutate();
                  } else {
                    saveMutation.mutate();
                  }
                }}
                disabled={saveMutation.isPending || unsaveMutation.isPending}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-5 w-5 mr-2" />
                ) : (
                  <Bookmark className="h-5 w-5 mr-2" />
                )}
                {isSaved ? "Saved" : "Save Recipe"}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recipe Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Total Time</p>
                      <p className="text-sm text-muted-foreground">{totalTime} mins</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Utensils className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Cuisine</p>
                      <p className="text-sm text-muted-foreground">{recipe.cuisine}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Servings</p>
                      <p className="text-sm text-muted-foreground">{recipe.servings}</p>
                    </div>
                  </div>
                </div>

                {recipe.dietaryRestrictions && recipe.dietaryRestrictions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Dietary Information</h3>
                    <div className="flex flex-wrap gap-2">
                      {recipe.dietaryRestrictions.map((restriction) => (
                        <Badge key={restriction} variant="outline">
                          {restriction}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator className="my-6" />

                <div className="space-y-6">
                  {recipe.ingredients && recipe.ingredients.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
                      <ul className="space-y-2">
                        {recipe.ingredients.map((ingredient, index) => (
                          <li key={index} className="text-sm">
                            {ingredient}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {recipe.instructions && recipe.instructions.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Instructions</h3>
                      <ol className="space-y-4">
                        {recipe.instructions.map((instruction, index) => (
                          <li key={index} className="text-sm flex gap-4">
                            <span className="font-medium text-muted-foreground">
                              {index + 1}.
                            </span>
                            {instruction}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Prep Time</h3>
                    <p className="text-sm text-muted-foreground">
                      {recipe.prepTime} mins
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Cook Time</h3>
                    <p className="text-sm text-muted-foreground">
                      {recipe.cookTime} mins
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}