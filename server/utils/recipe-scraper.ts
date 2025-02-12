import axios from 'axios';
import * as cheerio from 'cheerio';
import { InsertRecipe } from '@shared/schema';

export async function scrapeRecipes(url: string): Promise<Partial<InsertRecipe>[]> {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const recipes: Partial<InsertRecipe>[] = [];

    // Example scraping selectors - these would need to be adjusted based on the target website
    $('.recipe-card').each((_, element) => {
      const title = $(element).find('.recipe-title').text().trim();
      const description = $(element).find('.recipe-description').text().trim();
      const imageUrl = $(element).find('.recipe-image').attr('src');
      const cuisine = $(element).find('.recipe-cuisine').text().trim();
      
      // Convert ingredient list items to array
      const ingredients: string[] = [];
      $(element).find('.recipe-ingredients li').each((_, ing) => {
        ingredients.push($(ing).text().trim());
      });

      // Convert instruction list items to array
      const instructions: string[] = [];
      $(element).find('.recipe-instructions li').each((_, inst) => {
        instructions.push($(inst).text().trim());
      });

      const prepTimeText = $(element).find('.prep-time').text().trim();
      const cookTimeText = $(element).find('.cook-time').text().trim();
      
      // Extract numbers from time strings
      const prepTime = parseInt(prepTimeText.match(/\d+/)?.[0] || '0');
      const cookTime = parseInt(cookTimeText.match(/\d+/)?.[0] || '0');

      const recipe: Partial<InsertRecipe> = {
        title,
        description,
        imageUrl,
        cuisine: cuisine || 'International',
        ingredients,
        instructions,
        prepTime,
        cookTime,
        servings: 4, // Default value
        dietaryRestrictions: [], // Would need to be parsed from recipe data
      };

      if (title && description && imageUrl) {
        recipes.push(recipe);
      }
    });

    return recipes;
  } catch (error) {
    console.error('Error scraping recipes:', error);
    throw error;
  }
}
