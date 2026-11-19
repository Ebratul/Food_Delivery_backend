// One-off helper: pulls real dishes (name, ingredients, photo) from TheMealDB
// and stores them in prisma/data/meals.json so seeding works offline.
// Usage: node scripts/fetch-meals.js
import { writeFile } from "node:fs/promises";

// cuisine label -> TheMealDB area (country) filter
const AREAS = {
  Indian: "India",
  Italian: "Italy",
  Chinese: "China",
  Japanese: "Japan",
  Thai: "Thailand",
  American: "United States",
  Turkish: "Turkey",
  Vietnamese: "Vietnam",
};
const API = "https://www.themealdb.com/api/json/v1/1";

const get = async (path) => {
  const res = await fetch(`${API}/${path}`);
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.json();
};

const result = {};
for (const [area, country] of Object.entries(AREAS)) {
  const { meals } = await get(`filter.php?a=${encodeURIComponent(country)}`);
  const picked = meals.slice(0, 16);
  result[area] = [];
  for (const m of picked) {
    const { meals: [full] } = await get(`lookup.php?i=${m.idMeal}`);
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ing = full[`strIngredient${i}`]?.trim();
      if (ing) ingredients.push(ing.toLowerCase());
    }
    result[area].push({
      name: full.strMeal.trim(),
      category: full.strCategory,
      image: full.strMealThumb,
      ingredients,
    });
  }
  process.stdout.write(`${area}: ${result[area].length}\n`);
}
await writeFile(new URL("../prisma/data/meals.json", import.meta.url), JSON.stringify(result, null, 2));
