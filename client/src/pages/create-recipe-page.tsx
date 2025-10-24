import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { PlusCircle, Trash2, Loader2, Check } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";

const CUISINE_TYPES = [
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

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Keto",
  "Paleo",
  "Halal",
  "Kosher"
];

export default function CreateRecipePage() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  // Redirect if not logged in
  if (!user) {
    setLocation("/auth");
    return null;
  }

  const createRecipeMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/recipes", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
      toast({
        title: "Success!",
        description: "Your recipe has been created.",
      });
      setLocation(`/recipes/${data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create recipe",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title || !description || !imageUrl || !cuisine || !prepTime || !cookTime || !servings) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const filteredIngredients = ingredients.filter(i => i.trim());
    const filteredInstructions = instructions.filter(i => i.trim());

    if (filteredIngredients.length === 0 || filteredInstructions.length === 0) {
      toast({
        title: "Missing content",
        description: "Please add at least one ingredient and one instruction",
        variant: "destructive",
      });
      return;
    }

    createRecipeMutation.mutate({
      title,
      description,
      imageUrl,
      cuisine,
      prepTime: parseInt(prepTime),
      cookTime: parseInt(cookTime),
      servings: parseInt(servings),
      ingredients: filteredIngredients,
      instructions: filteredInstructions,
      dietaryRestrictions: selectedDietary,
    });
  };

  const addIngredient = () => setIngredients([...ingredients, ""]);
  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };
  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addInstruction = () => setInstructions([...instructions, ""]);
  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };
  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const toggleDietary = (option: string) => {
    if (selectedDietary.includes(option)) {
      setSelectedDietary(selectedDietary.filter(d => d !== option));
    } else {
      setSelectedDietary([...selectedDietary, option]);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-muted/50 to-background py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <PlusCircle className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-2">
                Create New Recipe
              </h1>
              <p className="text-lg text-muted-foreground">
                Share your culinary creation with the community
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="container mx-auto px-4 py-8">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Recipe Details</CardTitle>
                <CardDescription>
                  Fill in the information about your recipe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Recipe Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Grandma's Chocolate Chip Cookies"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your recipe..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL *</Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      required
                    />
                    {imageUrl && (
                      <div className="mt-2">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cuisine">Cuisine Type *</Label>
                      <Select value={cuisine} onValueChange={setCuisine} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cuisine" />
                        </SelectTrigger>
                        <SelectContent>
                          {CUISINE_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="servings">Servings *</Label>
                      <Input
                        id="servings"
                        type="number"
                        min="1"
                        placeholder="4"
                        value={servings}
                        onChange={(e) => setServings(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prepTime">Prep Time (minutes) *</Label>
                      <Input
                        id="prepTime"
                        type="number"
                        min="0"
                        placeholder="15"
                        value={prepTime}
                        onChange={(e) => setPrepTime(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cookTime">Cook Time (minutes) *</Label>
                      <Input
                        id="cookTime"
                        type="number"
                        min="0"
                        placeholder="30"
                        value={cookTime}
                        onChange={(e) => setCookTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Dietary Restrictions</Label>
                    <div className="flex flex-wrap gap-2">
                      {DIETARY_OPTIONS.map((option) => (
                        <Badge
                          key={option}
                          variant={selectedDietary.includes(option) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleDietary(option)}
                        >
                          {selectedDietary.includes(option) && (
                            <Check className="h-3 w-3 mr-1" />
                          )}
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Ingredients *</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={addIngredient}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Ingredient ${index + 1}`}
                          value={ingredient}
                          onChange={(e) => updateIngredient(index, e.target.value)}
                        />
                        {ingredients.length > 1 && (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => removeIngredient(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Instructions *</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={addInstruction}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Step
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {instructions.map((instruction, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex-shrink-0 w-8 h-10 flex items-center justify-center font-medium text-muted-foreground">
                          {index + 1}.
                        </div>
                        <Textarea
                          placeholder={`Step ${index + 1}`}
                          value={instruction}
                          onChange={(e) => updateInstruction(index, e.target.value)}
                          rows={2}
                          className="flex-1"
                        />
                        {instructions.length > 1 && (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => removeInstruction(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={createRecipeMutation.isPending}
                  >
                    {createRecipeMutation.isPending && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Create Recipe
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/")}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
