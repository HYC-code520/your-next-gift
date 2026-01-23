import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../../context/LanguageContext';
import { Cake, Calendar, User, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

function BirthdaysManager() {
  const { t } = useLanguage();
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState('all');

  useEffect(() => {
    fetchBirthdays();
  }, []);

  const fetchBirthdays = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('birthdays')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setBirthdays(data || []);
    } catch (error) {
      console.error('Error fetching birthdays:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (monthNum) => {
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    return t(months[monthNum - 1]);
  };

  const filteredBirthdays = filterMonth === 'all'
    ? birthdays
    : birthdays.filter(b => {
        const month = new Date(b.date).getMonth() + 1;
        return month === parseInt(filterMonth);
      });

  const groupedByMonth = filteredBirthdays.reduce((acc, birthday) => {
    const month = new Date(birthday.date).getMonth() + 1;
    if (!acc[month]) acc[month] = [];
    acc[month].push(birthday);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Filter className="w-5 h-5 text-muted-foreground" />
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="px-4 py-2 bg-input border border-border rounded-md"
        >
          <option value="all">{t('allBirthdays')}</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
            <option key={month} value={month}>
              {getMonthName(month)}
            </option>
          ))}
        </select>
        <span className="text-sm text-muted-foreground">
          {filteredBirthdays.length} {filteredBirthdays.length === 1 ? 'birthday' : 'birthdays'}
        </span>
      </div>

      {/* Birthdays List */}
      {filteredBirthdays.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Cake className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">{t('noBirthdays')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByMonth)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([month, monthBirthdays]) => (
              <Card key={month}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {getMonthName(parseInt(month))}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({monthBirthdays.length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {monthBirthdays.map((birthday) => {
                      const date = new Date(birthday.date);
                      const today = new Date();
                      const thisYear = new Date(today.getFullYear(), date.getMonth(), date.getDate());
                      const daysUntil = Math.ceil((thisYear - today) / (1000 * 60 * 60 * 24));
                      
                      return (
                        <div
                          key={birthday.id}
                          className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                              <User className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h5 className="font-medium">{birthday.name}</h5>
                              <p className="text-sm text-muted-foreground">
                                {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                              </p>
                              {birthday.notes && (
                                <p className="text-xs text-muted-foreground mt-1">{birthday.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            {daysUntil === 0 ? (
                              <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                                {t('todayExclaim')}
                              </span>
                            ) : daysUntil > 0 && daysUntil < 30 ? (
                              <span className="text-sm text-muted-foreground">
                                {t('in')} {daysUntil} {daysUntil === 1 ? t('day') : t('days')}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}

export default BirthdaysManager;
