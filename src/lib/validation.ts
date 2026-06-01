import { z } from "zod";

const roastLevel = z
  .enum(["light", "medium-light", "medium", "medium-dark", "dark"])
  .nullable();
const roastPurpose = z.enum(["filter", "espresso", "omni"]).nullable();
const brewMethod = z
  .enum([
    "espresso",
    "v60",
    "aeropress",
    "frenchpress",
    "moka",
    "chemex",
    "coldbrew",
    "other",
  ])
  .nullable();
const milkType = z
  .enum(["whole", "semi", "skim", "oat", "almond", "soy", "other"])
  .nullable();
const drinkType = z
  .enum([
    "espresso",
    "filter",
    "americano",
    "cortado",
    "flatwhite",
    "cappuccino",
    "latte",
    "coldbrew",
    "icedlatte",
    "other",
  ])
  .nullable();

const str = z.string().trim().max(2000).nullable().optional();
// A blank date input must be dropped (not sent as "") so the NOT NULL column
// falls back to its `default current_date` instead of erroring.
const dateField = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date")
    .optional(),
);
const nullableInt = z.number().int().nullable().optional();
const nullableNum = z.number().nullable().optional();
const rating = z.number().int().min(1).max(5).nullable().optional();

export const coffeeInput = z.object({
  date_added: dateField,
  roaster: str,
  name: str,
  origin: str,
  producer: str,
  variety: str,
  process: str,
  altitude: str,
  tasting_notes: z.array(z.string().trim()).optional(),
  roast_level: roastLevel.optional(),
  roast_purpose: roastPurpose.optional(),
  decaf: z.boolean().optional(),
  weight_grams: nullableInt,
  price: nullableNum,
  currency: z.string().max(8).nullable().optional(),
  rating,
  liked: z.boolean().nullable().optional(),
  comments: str,
});

export type CoffeeInput = z.infer<typeof coffeeInput>;

export const recipeInput = z.object({
  coffee_id: z.string().uuid().nullable().optional(),
  name: str,
  method: brewMethod.optional(),
  dose_grams: nullableNum,
  yield_grams: nullableNum,
  grind: str,
  water_temp_c: nullableInt,
  time_seconds: nullableInt,
  milk_ml: nullableInt,
  milk_type: milkType.optional(),
  ice: z.boolean().optional(),
  notes: str,
});

export type RecipeInput = z.infer<typeof recipeInput>;

export const brewInput = z.object({
  coffee_id: z.string().uuid(),
  recipe_id: z.string().uuid().nullable().optional(),
  brew_date: dateField,
  drink_type: drinkType.optional(),
  liked: z.boolean().nullable().optional(),
  rating,
  notes: str,
});

export type BrewInput = z.infer<typeof brewInput>;

// For PATCH: same shape but everything optional and coffee_id not required.
export const brewPatch = brewInput.partial();
export const recipePatch = recipeInput.partial();
export const coffeePatch = coffeeInput.partial();
