// Debug script to check body specific products
const { products } = require('./src/data/index.ts');

console.log('=== ALL PRODUCTS DEBUG ===');
console.log(`Total products: ${products.length}`);

const routineTypes = [...new Set(products.map(p => p.routineType))];
console.log(`Routine types found: ${routineTypes.join(', ')}`);

const bodySpecificProducts = products.filter(p => p.routineType === 'bodySpecific');
console.log(`\nBody specific products count: ${bodySpecificProducts.length}`);

bodySpecificProducts.forEach(p => {
  console.log(`- ${p.id}: ${p.name} (${p.category}) - Areas: ${p.bodyAreas?.join(', ') || 'none'} - Time: ${p.timeOfDay}`);
});