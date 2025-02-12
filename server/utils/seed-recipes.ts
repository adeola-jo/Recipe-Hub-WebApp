import { storage } from "../storage";

const sampleRecipes = [
  {
    title: "Homemade Pizza",
    description: "Classic Italian pizza with a crispy crust and fresh toppings",
    ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella", "Fresh basil", "Olive oil"],
    instructions: [
      "Preheat oven to 450°F",
      "Roll out the pizza dough",
      "Spread tomato sauce",
      "Add cheese and toppings",
      "Bake for 15-20 minutes"
    ],
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    cuisine: "Italian",
    dietaryRestrictions: ["vegetarian"],
    prepTime: 20,
    cookTime: 20,
    servings: 4
  },
  {
    title: "Chicken Stir Fry",
    description: "Quick and easy Asian-inspired stir fry with fresh vegetables",
    ingredients: ["Chicken breast", "Mixed vegetables", "Soy sauce", "Ginger", "Garlic"],
    instructions: [
      "Cut chicken into bite-sized pieces",
      "Heat oil in wok",
      "Stir fry chicken until golden",
      "Add vegetables and sauce",
      "Cook until vegetables are tender"
    ],
    imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
    cuisine: "Asian",
    dietaryRestrictions: [],
    prepTime: 15,
    cookTime: 15,
    servings: 4
  }
];

export async function seedRecipes() {
  console.log("Seeding recipes...");
  for (const recipe of sampleRecipes) {
    try {
      await storage.createRecipe(recipe);
      console.log(`Created recipe: ${recipe.title}`);
    } catch (error) {
      console.error(`Failed to create recipe ${recipe.title}:`, error);
    }
  }
  console.log("Seeding completed");
}

// Run seeder if this file is executed directly
if (process.argv[1] === import.meta.url) {
  seedRecipes().then(() => process.exit(0));
}
