import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ingredients: jsonb("ingredients").notNull().$type<string[]>(),
  instructions: jsonb("instructions").notNull().$type<string[]>(),
  imageUrl: text("image_url").notNull(),
  cuisine: text("cuisine").notNull(),
  dietaryRestrictions: jsonb("dietary_restrictions").notNull().$type<string[]>(),
  prepTime: integer("prep_time").notNull(),
  cookTime: integer("cook_time").notNull(),
  servings: integer("servings").notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const savedRecipes = pgTable("saved_recipes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  recipeId: integer("recipe_id").references(() => recipes.id).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
});

export const insertSavedRecipeSchema = createInsertSchema(savedRecipes).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type InsertSavedRecipe = z.infer<typeof insertSavedRecipeSchema>;

export type User = typeof users.$inferSelect;
export type Recipe = typeof recipes.$inferSelect;
export type SavedRecipe = typeof savedRecipes.$inferSelect;
