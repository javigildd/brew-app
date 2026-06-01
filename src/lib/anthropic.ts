// Server-only: send a coffee-bag photo to Claude vision and get structured data.
import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { RoastLevel, RoastPurpose } from "./types";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  if (!client) client = new Anthropic();
  return client;
}

export type ImageMediaType =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/gif";

export interface ExtractedCoffee {
  roaster: string | null;
  name: string | null;
  origin: string | null;
  producer: string | null;
  variety: string | null;
  process: string | null;
  altitude: string | null;
  tasting_notes: string[];
  roast_level: RoastLevel | null;
  roast_purpose: RoastPurpose | null;
  decaf: boolean;
  weight_grams: number | null;
}

const SYSTEM_PROMPT = `You are an expert specialty-coffee assistant. You read a photo of a coffee bag/package and extract the printed information into structured fields.

Rules:
- Only use information that is actually visible on the package. Do NOT invent or guess.
- If a field is not present, return null for it (or an empty array for tasting_notes).
- Keep brand names, coffee names, origins and producer names exactly as printed (do not translate them).
- "origin" is the country and/or region (e.g. "Ethiopia, Yirgacheffe"). For blends, list the origins comma-separated.
- "process" is the processing method (e.g. Washed, Natural, Honey, Anaerobic).
- "tasting_notes" is an array of short flavour notes printed on the bag (e.g. ["chocolate", "orange", "caramel"]).
- "roast_level" must be one of: light, medium-light, medium, medium-dark, dark — infer the closest from any printed roast description; null if nothing indicates it.
- "roast_purpose" must be one of: filter, espresso, omni — use "omni" if it says suitable for both / multi-roast / all methods; null if not indicated.
- "weight_grams" is the net weight converted to grams (e.g. 250g -> 250, 12oz -> 340); null if not printed.
- "decaf" is true only if the bag clearly says decaf / descafeinado.
Always call the save_coffee_data tool with your result.`;

const tool: Anthropic.Tool = {
  name: "save_coffee_data",
  description:
    "Record the structured data extracted from the coffee bag photo. Use null for any field not visible on the package.",
  cache_control: { type: "ephemeral" },
  input_schema: {
    type: "object",
    properties: {
      roaster: { type: ["string", "null"], description: "Roaster / brand name" },
      name: { type: ["string", "null"], description: "Coffee name" },
      origin: {
        type: ["string", "null"],
        description: "Country and/or region of origin",
      },
      producer: {
        type: ["string", "null"],
        description: "Farm, producer or co-op",
      },
      variety: { type: ["string", "null"], description: "Coffee variety/varietal" },
      process: {
        type: ["string", "null"],
        description: "Processing method (Washed, Natural, Honey, ...)",
      },
      altitude: { type: ["string", "null"], description: "Growing altitude" },
      tasting_notes: {
        type: "array",
        items: { type: "string" },
        description: "Short flavour notes printed on the bag",
      },
      roast_level: {
        type: ["string", "null"],
        enum: ["light", "medium-light", "medium", "medium-dark", "dark", null],
        description: "Closest roast level",
      },
      roast_purpose: {
        type: ["string", "null"],
        enum: ["filter", "espresso", "omni", null],
        description: "Intended brew method",
      },
      decaf: { type: "boolean", description: "Whether it is decaffeinated" },
      weight_grams: {
        type: ["integer", "null"],
        description: "Net weight in grams",
      },
    },
    required: ["tasting_notes", "decaf"],
  } as Anthropic.Tool.InputSchema,
};

// Validate/coerce whatever the model returns into a clean ExtractedCoffee.
const ROAST_LEVELS = ["light", "medium-light", "medium", "medium-dark", "dark"] as const;
const ROAST_PURPOSES = ["filter", "espresso", "omni"] as const;

const nullableStr = z
  .union([z.string(), z.null()])
  .optional()
  .transform((v) => {
    const s = (v ?? "").toString().trim();
    return s.length ? s : null;
  });

const schema = z.object({
  roaster: nullableStr,
  name: nullableStr,
  origin: nullableStr,
  producer: nullableStr,
  variety: nullableStr,
  process: nullableStr,
  altitude: nullableStr,
  tasting_notes: z
    .array(z.string())
    .optional()
    .transform((arr) =>
      (arr ?? [])
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .slice(0, 20),
    ),
  roast_level: z
    .union([z.string(), z.null()])
    .optional()
    .transform((v) =>
      ROAST_LEVELS.includes(v as RoastLevel) ? (v as RoastLevel) : null,
    ),
  roast_purpose: z
    .union([z.string(), z.null()])
    .optional()
    .transform((v) =>
      ROAST_PURPOSES.includes(v as RoastPurpose) ? (v as RoastPurpose) : null,
    ),
  decaf: z
    .union([z.boolean(), z.null()])
    .optional()
    .transform((v) => v === true),
  weight_grams: z
    .union([z.number(), z.string(), z.null()])
    .optional()
    .transform((v) => {
      const n = typeof v === "string" ? parseInt(v, 10) : v;
      return typeof n === "number" && Number.isFinite(n) && n > 0
        ? Math.round(n)
        : null;
    }),
});

export async function extractCoffeeFromImage(
  base64Data: string,
  mediaType: ImageMediaType,
): Promise<ExtractedCoffee> {
  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [tool],
    tool_choice: { type: "tool", name: "save_coffee_data" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64Data },
          },
          {
            type: "text",
            text: "Extract the coffee data from this package photo.",
          },
        ],
      },
    ],
  });

  const toolUse = response.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
  );
  if (!toolUse) {
    throw new Error("Model did not return structured coffee data");
  }
  return schema.parse(toolUse.input);
}
