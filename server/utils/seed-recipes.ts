import { storage } from "../storage";

const sampleRecipes = [
  {
    title: "Jollof Rice",
    description: "Classic West African rice dish cooked in seasoned tomato broth",
    ingredients: [
      "Long grain rice",
      "Tomatoes",
      "Onions",
      "Scotch bonnet peppers",
      "Vegetable oil",
      "Bay leaves",
      "Thyme",
      "Curry powder",
      "Stock cubes"
    ],
    instructions: [
      "Blend tomatoes, red bell peppers, and scotch bonnets",
      "Sauté onions until translucent",
      "Add blended mixture and cook down",
      "Add spices and seasonings",
      "Add rice and stock, cook until tender"
    ],
    imageUrl: "https://images.unsplash.com/photo-1575503802870-45de6a6217c8",
    cuisine: "African",
    dietaryRestrictions: [],
    prepTime: 20,
    cookTime: 45,
    servings: 6
  },
  {
    title: "Butter Chicken",
    description: "Creamy and rich Indian curry with tender chicken pieces",
    ingredients: [
      "Chicken thighs",
      "Yogurt",
      "Tomato puree",
      "Heavy cream",
      "Butter",
      "Garam masala",
      "Kasuri methi",
      "Ginger garlic paste"
    ],
    instructions: [
      "Marinate chicken in yogurt and spices",
      "Grill or bake the marinated chicken",
      "Prepare the curry sauce",
      "Combine chicken with the sauce",
      "Finish with cream and butter"
    ],
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
    cuisine: "Indian",
    dietaryRestrictions: [],
    prepTime: 30,
    cookTime: 40,
    servings: 4
  },
  {
    title: "Coq au Vin",
    description: "Classic French braised chicken in red wine sauce",
    ingredients: [
      "Chicken pieces",
      "Red wine",
      "Pearl onions",
      "Mushrooms",
      "Bacon lardons",
      "Thyme",
      "Bay leaf",
      "Chicken stock"
    ],
    instructions: [
      "Brown the chicken pieces",
      "Cook bacon and vegetables",
      "Add wine and reduce",
      "Braise chicken until tender",
      "Thicken sauce and serve"
    ],
    imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e",
    cuisine: "European",
    dietaryRestrictions: [],
    prepTime: 25,
    cookTime: 60,
    servings: 4
  },
  {
    title: "Mediterranean Mezze Platter",
    description: "Assortment of Middle Eastern appetizers and dips",
    ingredients: [
      "Hummus",
      "Baba ganoush",
      "Pita bread",
      "Olives",
      "Feta cheese",
      "Cucumber",
      "Cherry tomatoes",
      "Fresh herbs"
    ],
    instructions: [
      "Prepare hummus and baba ganoush",
      "Cut vegetables and bread",
      "Arrange all components on a platter",
      "Garnish with olive oil and herbs",
      "Serve with warm pita bread"
    ],
    imageUrl: "https://images.unsplash.com/photo-1542345812-d98b5cd6cf98",
    cuisine: "Mediterranean",
    dietaryRestrictions: ["vegetarian"],
    prepTime: 20,
    cookTime: 10,
    servings: 6
  },
  {
    title: "Pad Thai",
    description: "Classic Thai stir-fried rice noodles with tamarind sauce",
    ingredients: [
      "Rice noodles",
      "Shrimp or tofu",
      "Bean sprouts",
      "Eggs",
      "Peanuts",
      "Tamarind paste",
      "Fish sauce",
      "Palm sugar"
    ],
    instructions: [
      "Soak noodles until tender",
      "Prepare tamarind sauce",
      "Stir-fry protein and vegetables",
      "Add noodles and sauce",
      "Toss with bean sprouts and peanuts"
    ],
    imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e",
    cuisine: "Asian",
    dietaryRestrictions: [],
    prepTime: 20,
    cookTime: 15,
    servings: 2
  }
];

export async function seedRecipes() {
  console.log("Starting recipe seeding process...");

  try {
    console.log("Clearing existing recipes...");
    await storage.clearRecipes();
    console.log("Successfully cleared existing recipes");

    console.log("Seeding new recipes...");
    for (const recipe of sampleRecipes) {
      try {
        const createdRecipe = await storage.createRecipe(recipe);
        console.log(`✓ Created recipe: ${createdRecipe.title}`);
      } catch (error) {
        console.error(`Failed to create recipe ${recipe.title}:`, error);
      }
    }
    console.log("Recipe seeding completed successfully");
  } catch (error) {
    console.error("Failed during recipe seeding process:", error);
    throw error;
  }
}

// Run seeder if this file is executed directly
if (process.argv[1] === import.meta.url) {
  seedRecipes()
    .then(() => {
      console.log("Seeding completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}