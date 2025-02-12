import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertRecipeSchema } from "@shared/schema";
import { scrapeRecipes } from "./utils/recipe-scraper";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Recipe routes
  app.get("/api/recipes", async (_req, res) => {
    const recipes = await storage.getRecipes();
    res.json(recipes);
  });

  app.get("/api/recipes/:id", async (req, res) => {
    const recipe = await storage.getRecipe(parseInt(req.params.id));
    if (!recipe) {
      res.status(404).send("Recipe not found");
      return;
    }
    res.json(recipe);
  });

  app.post("/api/recipes", async (req, res) => {
    if (!req.isAuthenticated()) {
      res.status(401).send("Unauthorized");
      return;
    }

    const parseResult = insertRecipeSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json(parseResult.error);
      return;
    }

    const recipe = await storage.createRecipe({
      ...parseResult.data,
      userId: req.user.id,
    });
    res.status(201).json(recipe);
  });

  // New route for scraping recipes
  app.post("/api/recipes/scrape", async (req, res) => {
    if (!req.isAuthenticated()) {
      res.status(401).send("Unauthorized");
      return;
    }

    try {
      const { url } = req.body;
      if (!url) {
        res.status(400).send("URL is required");
        return;
      }

      const scrapedRecipes = await scrapeRecipes(url);
      const savedRecipes = [];

      for (const recipeData of scrapedRecipes) {
        const parseResult = insertRecipeSchema.safeParse({
          ...recipeData,
          userId: req.user.id,
        });

        if (parseResult.success) {
          const recipe = await storage.createRecipe(parseResult.data);
          savedRecipes.push(recipe);
        }
      }

      res.json({
        message: `Successfully scraped and saved ${savedRecipes.length} recipes`,
        recipes: savedRecipes,
      });
    } catch (error) {
      console.error('Error in recipe scraping:', error);
      res.status(500).send("Failed to scrape recipes");
    }
  });

  // Saved recipes routes
  app.get("/api/saved-recipes", async (req, res) => {
    if (!req.isAuthenticated()) {
      res.status(401).send("Unauthorized");
      return;
    }

    const recipes = await storage.getSavedRecipes(req.user.id);
    res.json(recipes);
  });

  app.post("/api/saved-recipes/:recipeId", async (req, res) => {
    if (!req.isAuthenticated()) {
      res.status(401).send("Unauthorized");
      return;
    }

    const recipeId = parseInt(req.params.recipeId);
    const recipe = await storage.getRecipe(recipeId);
    if (!recipe) {
      res.status(404).send("Recipe not found");
      return;
    }

    const savedRecipe = await storage.saveRecipe({
      userId: req.user.id,
      recipeId,
    });
    res.status(201).json(savedRecipe);
  });

  app.delete("/api/saved-recipes/:recipeId", async (req, res) => {
    if (!req.isAuthenticated()) {
      res.status(401).send("Unauthorized");
      return;
    }

    const recipeId = parseInt(req.params.recipeId);
    await storage.unsaveRecipe(req.user.id, recipeId);
    res.sendStatus(200);
  });

  const httpServer = createServer(app);
  return httpServer;
}