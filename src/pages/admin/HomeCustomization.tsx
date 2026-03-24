import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Save, Eye, EyeOff, Image as ImageIcon, Layout } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

interface HomeSection {
  id: string;
  title: string;
  title_od: string;
  type: 'banner' | 'new_arrivals' | 'featured_category' | 'custom_list';
  content: any;
  active: boolean;
  order: number;
}

export default function HomeCustomization() {
  const { t, language } = useLanguage();
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'shop');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSections(data.homeSections || []);
          setShopName(data.shopName || '');
          setShopAddress(data.shopAddress || '');
        } else {
          // Default sections if none exist
          const defaultSections: HomeSection[] = [
            {
              id: 'banner-1',
              title: 'Welcome Offer',
              title_od: 'ସ୍ୱାଗତ ଅଫର',
              type: 'banner',
              content: { image: 'https://picsum.photos/seed/shop/800/400', link: '#' },
              active: true,
              order: 0
            },
            {
              id: 'new-arrivals',
              title: 'New Arrivals',
              title_od: 'ନୂଆ ଜିନିଷ',
              type: 'new_arrivals',
              content: {},
              active: true,
              order: 1
            }
          ];
          setSections(defaultSections);
          setShopName('Ma Tarini Grocery Shop');
          setShopAddress('Bypass Road, Village');
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'shop'), { 
        homeSections: sections,
        shopName,
        shopAddress
      }, { merge: true });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    const newSection: HomeSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      title_od: 'ନୂଆ ବିଭାଗ',
      type: 'custom_list',
      content: {},
      active: true,
      order: sections.length
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const toggleActive = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const updateSection = (id: string, updates: Partial<HomeSection>) => {
    setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-3xl font-bold text-text">{t('admin.home.title')}</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-6 py-2 rounded-xl font-bold shadow-md flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? t('admin.home.saving') : t('admin.home.save')}
        </motion.button>
      </div>

      {/* Shop Settings */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Layout className="text-primary" size={20} />
          <h3 className="font-bold text-lg text-text">{t('admin.shop.title')}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-muted mb-1 uppercase">{t('admin.shop.name')}</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 font-medium focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted mb-1 uppercase">{t('admin.shop.address')}</label>
            <input
              type="text"
              value={shopAddress}
              onChange={(e) => setShopAddress(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 font-medium focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      <div className="space-y-4">
        <h3 className="font-bold text-lg text-text px-1">{t('admin.home.title')}</h3>
        {sections.sort((a, b) => a.order - b.order).map((section, index) => (
          <motion.div
            key={section.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white p-6 rounded-2xl shadow-sm border ${section.active ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}
          >
            <div className="flex items-start gap-4">
              <div className="cursor-grab text-muted mt-1">
                <GripVertical size={24} />
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg text-primary">
                      {section.type === 'banner' && <ImageIcon size={20} />}
                      {section.type !== 'banner' && <Layout size={20} />}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted">{section.type.replace('_', ' ')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleActive(section.id)}
                      className={`p-2 rounded-lg transition-colors ${section.active ? 'text-green-600 bg-green-50' : 'text-muted bg-gray-50'}`}
                    >
                      {section.active ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                    <button 
                      onClick={() => removeSection(section.id)}
                      className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted mb-1 uppercase">{t('admin.home.titleEn')}</label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 font-medium focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted mb-1 uppercase">{t('admin.home.titleOd')}</label>
                    <input
                      type="text"
                      value={section.title_od}
                      onChange={(e) => updateSection(section.id, { title_od: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 font-medium focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {section.type === 'banner' && (
                  <div>
                    <label className="block text-xs font-bold text-muted mb-1 uppercase">{t('admin.home.bannerUrl')}</label>
                    <input
                      type="text"
                      value={section.content.image}
                      onChange={(e) => updateSection(section.id, { content: { ...section.content, image: e.target.value } })}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 font-medium focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addSection}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-muted font-bold flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-all"
        >
          <Plus size={24} />
          {t('admin.home.addSection')}
        </motion.button>
      </div>
    </div>
  );
}
