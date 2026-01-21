import { useOutletContext } from 'react-router-dom';
import { Palette } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import DiyCard from './DiyCard';
import PageBanner from './PageBanner';

function DiyList() {
  const { diyProjects } = useOutletContext();
  const { t } = useLanguage();

  if (diyProjects.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Palette className="w-16 h-16 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground text-xl">{t('loadingDiyProjects')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageBanner 
        title={t('diyWishlistCentral')}
        className="list-page-banner"
      />
      
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Exactly 3 cards per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diyProjects.map((diyProject) => (
            <DiyCard key={diyProject.id} diyProjectDetails={diyProject} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DiyList;
