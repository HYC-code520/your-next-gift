import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function TopSearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="w-full flex justify-center px-6 py-3">
      <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={language === 'en' ? 'Search DIY projects...' : '搜尋 DIY 專案...'}
          className={`
            w-full px-5 py-2.5 pr-12 text-sm 
            bg-transparent 
            border-b-2 border-gray-200 dark:border-gray-700 
            focus:border-primary focus:outline-none 
            transition-all duration-300
            placeholder:text-gray-400
            text-center
          `}
        />
        <button 
          type="submit" 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

export default TopSearchBar;
