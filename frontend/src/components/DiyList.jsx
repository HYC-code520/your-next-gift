import { useOutletContext, Link } from 'react-router-dom';
import { useState } from 'react';
import { Palette, Search, X, SlidersHorizontal, Lightbulb, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import DiyCard from './DiyCard';
import CategoryFilter from './CategoryFilter';

function DiyList() {
  const { diyProjects } = useOutletContext();
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter projects by category and search query
  // Exclude the "Custom Request" project (it has its own special card)
  const filteredProjects = (diyProjects || []).filter(project => {
    if (project.projectName === 'Custom Request') return false;

    // Category filter
    const matchesCategory = selectedCategory === 'all'
      || (project.categories && project.categories.includes(selectedCategory));

    // Search filter (search in name, description, and materials)
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query
      || project.projectName?.toLowerCase().includes(query)
      || project.description?.toLowerCase().includes(query)
      || project.materials?.some(m => m.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Combined Search Bar and Filter */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full flex gap-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'en' ? 'Search projects...' : '搜尋專案...'}
                className="w-full pl-12 pr-10 py-3 bg-card/60 backdrop-blur-md border-2 border-border rounded-full text-sm focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.2)] transition-all duration-300 placeholder:text-muted-foreground outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-full border transition-all whitespace-nowrap ${
                showFilters || selectedCategory !== 'all'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card/60 backdrop-blur-md hover:bg-muted/60 border-border'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              {language === 'en' ? 'Filter' : '篩選'}
              {selectedCategory !== 'all' && (
                <span className="ml-1 w-2 h-2 rounded-full bg-current"></span>
              )}
            </button>
          </div>
        </div>

        {/* Category Filter - Collapsible */}
        {showFilters && (
          <div className="mb-6 animate-in slide-in-from-top duration-200">
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        )}

        {/* Results count */}
        {(searchQuery || selectedCategory !== 'all') && (
          <p className="text-sm text-muted-foreground text-center mb-4">
            {language === 'en' 
              ? `Showing ${filteredProjects.length} of ${diyProjects.length} projects`
              : `顯示 ${filteredProjects.length} / ${diyProjects.length} 個專案`
            }
          </p>
        )}

        {/* Exactly 3 cards per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {/* Custom Request Card - always shown first */}
          {(selectedCategory === 'all' || selectedCategory === 'Custom') && (
            <Link
              to="/list/custom-request"
              className="group rounded-lg border-2 border-dashed border-primary/40 hover:border-primary bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col items-center justify-center text-center p-8 min-h-[380px]"
              style={{ animation: `cardStaggerIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0s both` }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors duration-300">
                <Lightbulb className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">
                {language === 'en' ? 'Have an idea?' : '有想法嗎？'}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-[200px]">
                {language === 'en'
                  ? 'Request anything you\'d like me to make! Add photos and details.'
                  : '告訴我你想要什麼禮物！可以附上照片和細節。'}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all duration-300">
                {language === 'en' ? 'Make a Request' : '提出請求'}
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          )}

          {filteredProjects.map((diyProject, index) => (
            <DiyCard key={diyProject.id} diyProjectDetails={diyProject} index={index} />
          ))}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-lg mb-2">
              {language === 'en' ? 'No projects found' : '找不到專案'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-primary hover:underline text-sm"
              >
                {language === 'en' ? 'Clear search' : '清除搜尋'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DiyList;
