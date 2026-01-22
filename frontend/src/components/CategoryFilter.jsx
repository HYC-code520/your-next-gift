import { useLanguage } from '../context/LanguageContext';

// Assign different colors from our palette to each category
const categories = [
  { id: 'all', label: { en: 'All', zh: '全部' }, color: 'bg-[hsl(210,100%,90%)] text-[hsl(231,44%,28%)]' }, // Sky Blue
  { id: 'Wood', label: { en: 'Wood', zh: '木工' }, color: 'bg-[hsl(232,76%,74%)] text-[hsl(231,44%,28%)]' }, // Periwinkle
  { id: 'Bag', label: { en: 'Bag', zh: '包包' }, color: 'bg-[hsl(252,76%,80%)] text-[hsl(231,44%,28%)]' }, // Lavender
  { id: 'Pet', label: { en: 'Pet', zh: '寵物' }, color: 'bg-[hsl(307,58%,85%)] text-[hsl(231,44%,28%)]' }, // Pink
  { id: 'Photo Frame', label: { en: 'Photo Frame', zh: '相框' }, color: 'bg-[hsl(72,68%,80%)] text-[hsl(231,44%,28%)]' }, // Lime
  { id: 'Decor', label: { en: 'Decor', zh: '裝飾' }, color: 'bg-[hsl(210,100%,90%)] text-[hsl(231,44%,28%)]' }, // Sky Blue
  { id: 'Bouquet', label: { en: 'Bouquet', zh: '花束' }, color: 'bg-[hsl(307,58%,85%)] text-[hsl(231,44%,28%)]' }, // Pink
  { id: 'Food', label: { en: 'Food', zh: '食物' }, color: 'bg-[hsl(72,68%,80%)] text-[hsl(231,44%,28%)]' }, // Lime
  { id: 'Home', label: { en: 'Home', zh: '居家' }, color: 'bg-[hsl(232,76%,74%)] text-[hsl(231,44%,28%)]' }, // Periwinkle
];

function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const { language } = useLanguage();

  return (
    <div className="flex flex-wrap gap-3 mb-8 justify-center">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`
            px-5 py-2.5 rounded-full text-sm font-semibold 
            transition-all duration-200
            ${selectedCategory === cat.id 
              ? `${cat.color} shadow-lg scale-105` 
              : `bg-white text-[hsl(231,44%,28%)] border border-border hover:${cat.color.replace('bg-', 'bg-').replace('text-', 'text-')} hover:shadow-md hover:scale-105`
            }
          `}
        >
          {cat.label[language]}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
