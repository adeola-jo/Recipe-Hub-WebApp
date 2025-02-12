import axios from 'axios';
import * as cheerio from 'cheerio';
import { InsertRecipe } from '@shared/schema';

export async function scrapeRecipes(url: string): Promise<Partial<InsertRecipe>[]> {
  try {
    // For demo purposes, let's scrape from allrecipes.com
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const recipes: Partial<InsertRecipe>[] = [];

    // Example: scraping from allrecipes.com structure
    $('.recipe-card, .card__recipe').each((_, element) => {
      const title = $(element).find('.card__title, .title').text().trim();
      const description = $(element).find('.card__summary, .recipe-summary').text().trim();
      const imageUrl = $(element).find('img.recipe-image').attr('src') || 
                      'https://images.unsplash.com/photo-1495521821757-a1efb6729352';

      // Get ingredients
      const ingredients: string[] = [];
      $('.ingredients-item').each((_, ing) => {
        ingredients.push($(ing).text().trim());
      });

      // Get instructions
      const instructions: string[] = [];
      $('.instructions-section .section-body').each((_, inst) => {
        instructions.push($(inst).text().trim());
      });

      // Extract cooking times
      const prepTimeText = $(element).find('.recipe-meta-item:contains("prep")').text();
      const cookTimeText = $(element).find('.recipe-meta-item:contains("cook")').text();

      const prepTime = parseInt(prepTimeText.match(/\d+/)?.[0] || '20');
      const cookTime = parseInt(cookTimeText.match(/\d+/)?.[0] || '30');

      const recipe: Partial<InsertRecipe> = {
        title: title || 'Delicious Recipe',
        description: description || 'A tasty homemade recipe',
        imageUrl: imageUrl,
        cuisine: 'International', // Default value
        ingredients: ingredients.length > 0 ? ingredients : ['Ingredients to be added'],
        instructions: instructions.length > 0 ? instructions : ['Instructions to be added'],
        prepTime: prepTime,
        cookTime: cookTime,
        servings: 4,
        dietaryRestrictions: [],
      };

      if (title || description) {
        recipes.push(recipe);
      }
    });

    // If no recipes were found, add a sample recipe
    if (recipes.length === 0) {
      recipes.push({
        title: "Classic Pasta Carbonara",
        description: "A creamy Italian pasta dish with eggs, cheese, pancetta and black pepper",
        ingredients: [
          "400g spaghetti",
          "200g pancetta",
          "4 large eggs",
          "100g Pecorino Romano",
          "Black pepper"
        ],
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
        servings: 4
      });
    }

    return recipes;
  } catch (error) {
    console.error('Error scraping recipes:', error);
    throw error;
  }
}