// ========================================
// Grocery List Data
// ========================================

export interface GroceryCategory {
  name: string;
  emoji: string;
  items: { name: string; quantity?: string }[];
}

// =====================
// MASTER SETUP (Long-term pantry staples)
// =====================
export const masterSetupCategories: GroceryCategory[] = [
  {
    name: "Base / Grains",
    emoji: "🍚",
    items: [
      { name: "Rice (raw)", quantity: "350–400 g" },
    ],
  },
  {
    name: "Dry Fruits",
    emoji: "🥜",
    items: [
      { name: "Walnuts" },
      { name: "Almonds" },
    ],
  },
  {
    name: "Fridge Condiments",
    emoji: "🧴",
    items: [
      { name: "Soy sauce" },
      { name: "Red chili sauce" },
      { name: "Tomato ketchup" },
      { name: "Vinegar (or lemon)" },
      { name: "Peanut butter", quantity: "1 small jar" },
    ],
  },
  {
    name: "Pulses",
    emoji: "🫘",
    items: [
      { name: "Dry chana (chickpeas)", quantity: "100–120 g" },
      { name: "Dry rajma (kidney beans)", quantity: "100–120 g" },
      { name: "Red lentils (masoor dal)" },
      { name: "Moong dal (yellow)", quantity: "½ cup" },
    ],
  },
  {
    name: "Cooking Basics",
    emoji: "🍳",
    items: [
      { name: "Vegetable oil" },
      { name: "Ghee", quantity: "small" },
      { name: "Butter / Olive oil", quantity: "optional" },
      { name: "Cornflour", quantity: "small pack (~2 tsp)" },
      { name: "Besan (gram flour)", quantity: "~60 g (½ cup)" },
    ],
  },
  {
    name: "Whole Spices",
    emoji: "🌶️",
    items: [
      { name: "Cumin seeds" },
      { name: "Mustard seeds" },
      { name: "Fennel seeds" },
      { name: "Ajwain" },
      { name: "Hing (asafoetida)" },
      { name: "Black pepper" },
      { name: "Salt" },
    ],
  },
  {
    name: "Spice Powders / Masalas",
    emoji: "🌶️",
    items: [
      { name: "Coriander powder" },
      { name: "Turmeric powder" },
      { name: "Red chili powder" },
      { name: "Pav bhaji masala" },
      { name: "Roasted cumin powder" },
      { name: "Chilli flakes", quantity: "optional" },
    ],
  },
  {
    name: "Beverages",
    emoji: "🍵",
    items: [
      { name: "Tea leaves" },
      { name: "Matcha - Mezame" },
      { name: "Vanilla essence" },
    ],
  },
];

// =====================
// WEEKLY (Fresh items to buy every week)
// =====================
export const weeklyCategories: GroceryCategory[] = [
  {
    name: "Vegetables",
    emoji: "🥬",
    items: [
      { name: "Onion (red)", quantity: "2" },
      { name: "Tomato", quantity: "1" },
      { name: "Capsicum", quantity: "3" },
      { name: "Carrots", quantity: "6–7" },
      { name: "Cucumber", quantity: "3" },
      { name: "Sweet corn kernels", quantity: "250 g (frozen OK)" },
      { name: "Sprouts", quantity: "200 g" },
    ],
  },
  {
    name: "Fruits",
    emoji: "🍊",
    items: [
      { name: "Avocado", quantity: "1 large" },
      { name: "Oranges", quantity: "2" },
    ],
  },
  {
    name: "Bread",
    emoji: "🍞",
    items: [
      { name: "Bread", quantity: "1 loaf" },
    ],
  },
  {
    name: "Dairy",
    emoji: "🥛",
    items: [
      { name: "Paneer", quantity: "~500 g" },
      { name: "Thick curd/dahi", quantity: "500 g" },
      { name: "Milk", quantity: "1 L (optional)" },
    ],
  },
  {
    name: "Aromatics / Add-ons",
    emoji: "🧄",
    items: [
      { name: "Ginger–garlic paste", quantity: "200 g" },
      { name: "Green chili paste", quantity: "100–200 g" },
      { name: "Mint–coriander chutney", quantity: "200–250 g" },
      { name: "Bottled lemon juice", quantity: "250 ml" },
      { name: "Dried curry leaves", quantity: "optional" },
    ],
  },
];

// =====================
// Category color mappings
// =====================
export const categoryColors: Record<string, { bg: string; border: string }> = {
  "Base / Grains": { bg: "bg-amber-50", border: "border-amber-200" },
  "Dry Fruits": { bg: "bg-orange-50", border: "border-orange-200" },
  "Fridge Condiments": { bg: "bg-blue-50", border: "border-blue-200" },
  "Pulses": { bg: "bg-yellow-50", border: "border-yellow-200" },
  "Cooking Basics": { bg: "bg-slate-50", border: "border-slate-200" },
  "Whole Spices": { bg: "bg-red-50", border: "border-red-200" },
  "Spice Powders / Masalas": { bg: "bg-rose-50", border: "border-rose-200" },
  "Beverages": { bg: "bg-green-50", border: "border-green-200" },
  "Vegetables": { bg: "bg-emerald-50", border: "border-emerald-200" },
  "Fruits": { bg: "bg-orange-50", border: "border-orange-200" },
  "Bread": { bg: "bg-amber-50", border: "border-amber-200" },
  "Dairy": { bg: "bg-sky-50", border: "border-sky-200" },
  "Aromatics / Add-ons": { bg: "bg-lime-50", border: "border-lime-200" },
};
