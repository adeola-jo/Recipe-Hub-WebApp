import { 
  User, InsertUser, Recipe, InsertRecipe,
  SavedRecipe, InsertSavedRecipe 
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getRecipes(): Promise<Recipe[]>;
  getRecipe(id: number): Promise<Recipe | undefined>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  
  getSavedRecipes(userId: number): Promise<Recipe[]>;
  saveRecipe(savedRecipe: InsertSavedRecipe): Promise<SavedRecipe>;
  unsaveRecipe(userId: number, recipeId: number): Promise<void>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private recipes: Map<number, Recipe>;
  private savedRecipes: Map<number, SavedRecipe>;
  private currentUserId: number;
  private currentRecipeId: number;
  private currentSavedRecipeId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.recipes = new Map();
    this.savedRecipes = new Map();
    this.currentUserId = 1;
    this.currentRecipeId = 1;
    this.currentSavedRecipeId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Seed some initial recipes
    this.seedRecipes();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values());
  }

  async getRecipe(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const id = this.currentRecipeId++;
    const recipe: Recipe = { ...insertRecipe, id };
    this.recipes.set(id, recipe);
    return recipe;
  }

  async getSavedRecipes(userId: number): Promise<Recipe[]> {
    const saved = Array.from(this.savedRecipes.values()).filter(
      (sr) => sr.userId === userId
    );
    return saved.map((sr) => this.recipes.get(sr.recipeId)!);
  }

  async saveRecipe(insertSavedRecipe: InsertSavedRecipe): Promise<SavedRecipe> {
    const id = this.currentSavedRecipeId++;
    const savedRecipe: SavedRecipe = { ...insertSavedRecipe, id };
    this.savedRecipes.set(id, savedRecipe);
    return savedRecipe;
  }

  async unsaveRecipe(userId: number, recipeId: number): Promise<void> {
    const savedRecipeEntry = Array.from(this.savedRecipes.entries()).find(
      ([_, sr]) => sr.userId === userId && sr.recipeId === recipeId
    );
    if (savedRecipeEntry) {
      this.savedRecipes.delete(savedRecipeEntry[0]);
    }
  }

  private seedRecipes() {
    const sampleRecipes: InsertRecipe[] = [
      {
        title: "Classic Spaghetti Carbonara",
        description: "A creamy Italian pasta dish with eggs, cheese, pancetta and black pepper",
        ingredients: ["400g spaghetti", "200g pancetta", "4 large eggs", "100g Pecorino Romano"],
        instructions: [
          "Cook pasta in salted water",
          "Fry pancetta until crispy",
          "Mix eggs and cheese",
          "Combine all ingredients"
        ],
        imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3",
        cuisine: "Italian",
        dietaryRestrictions: [],
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        userId: null
      },
      // Add more sample recipes here
    ];

    sampleRecipes.forEach((recipe) => this.createRecipe(recipe));
  }
}

export const storage = new MemStorage();
