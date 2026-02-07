/**
 * ModernSupportSystem - Support Without Friction
 * Inline help, searchable knowledge base, one-tap escalation
 * Support feels present but invisible
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  ChevronRight,
  Book,
  MessageCircle,
  Phone,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Activity,
  Calendar,
  Shield,
} from 'lucide-react';
import { Button } from './ui/button';

interface ModernSupportSystemProps {
  language: 'sw' | 'en';
  onClose: () => void;
  onContactSupport?: () => void;
}

export function ModernSupportSystem({
  language,
  onClose,
  onContactSupport,
}: ModernSupportSystemProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const content = {
    sw: {
      title: 'Msaada & Maswali',
      subtitle: 'Tuko hapa kukusaidia',
      search: 'Tafuta msaada...',
      categories: 'Kategoria',
      popular: 'Maswali Maarufu',
      contact: 'Wasiliana Nasi',
      emergency: 'Dharura? Piga 112',
      helpful: 'Je, hii imesaidia?',
      yes: 'Ndiyo',
      no: 'Hapana',
      needMore: 'Unahitaji msaada zaidi?',
      chatSupport: 'Zungumza na Msaidizi',
      categories_list: [
        {
          id: 'getting-started',
          title: 'Kuanza',
          icon: Book,
          articles: 3,
        },
        {
          id: 'symptoms',
          title: 'Tathmini ya Dalili',
          icon: Activity,
          articles: 5,
        },
        {
          id: 'appointments',
          title: 'Miadi',
          icon: Calendar,
          articles: 4,
        },
        {
          id: 'privacy',
          title: 'Faragha & Usalama',
          icon: Shield,
          articles: 6,
        },
      ],
      popular_articles: [
        {
          id: '1',
          title: 'Jinsi ya kutumia tathmini ya dalili',
          category: 'Kuanza',
          views: 1234,
        },
        {
          id: '2',
          title: 'Jinsi ya kupanga miadi',
          category: 'Miadi',
          views: 987,
        },
        {
          id: '3',
          title: 'Je, data yangu ni salama?',
          category: 'Faragha',
          views: 856,
        },
      ],
    },
    en: {
      title: 'Help & Support',
      subtitle: 'We\'re here to help you',
      search: 'Search for help...',
      categories: 'Categories',
      popular: 'Popular Questions',
      contact: 'Contact Us',
      emergency: 'Emergency? Call 112',
      helpful: 'Was this helpful?',
      yes: 'Yes',
      no: 'No',
      needMore: 'Need more help?',
      chatSupport: 'Chat with Support',
      categories_list: [
        {
          id: 'getting-started',
          title: 'Getting Started',
          icon: Book,
          articles: 3,
        },
        {
          id: 'symptoms',
          title: 'Symptom Checker',
          icon: HelpCircle,
          articles: 5,
        },
        {
          id: 'appointments',
          title: 'Appointments',
          icon: CheckCircle2,
          articles: 4,
        },
        {
          id: 'privacy',
          title: 'Privacy & Security',
          icon: Info,
          articles: 6,
        },
      ],
      popular_articles: [
        {
          id: '1',
          title: 'How to use the symptom checker',
          category: 'Getting Started',
          views: 1234,
        },
        {
          id: '2',
          title: 'How to book an appointment',
          category: 'Appointments',
          views: 987,
        },
        {
          id: '3',
          title: 'Is my data secure?',
          category: 'Privacy',
          views: 856,
        },
      ],
    },
  };

  const t = content[language];

  const filteredArticles = searchQuery
    ? t.popular_articles.filter((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : t.popular_articles;

  if (selectedArticle) {
    return (
      <ArticleView
        article={selectedArticle}
        language={language}
        onBack={() => setSelectedArticle(null)}
        onContactSupport={onContactSupport}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-[#FAFBFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1D23]">{t.title}</h1>
            <p className="text-sm text-[#6B7280]">{t.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-[#1A1D23]" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-80px)] pb-8">
        <div className="max-w-4xl mx-auto px-6 py-6 space-y-8">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search}
              className="w-full h-14 pl-12 pr-4 bg-white border-2 border-[#E5E7EB] rounded-xl text-base focus:border-[#1E88E5] focus:outline-none transition-colors"
            />
          </div>

          {/* Emergency banner */}
          <div className="p-4 bg-gradient-to-r from-[#EF4444] to-[#DC2626] rounded-xl text-white">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold mb-1">{t.emergency}</p>
                <p className="text-sm opacity-90">
                  {language === 'sw'
                    ? 'Kwa hali za dharura za afya, piga 112 mara moja'
                    : 'For medical emergencies, call 112 immediately'}
                </p>
              </div>
            </div>
          </div>

          {/* Categories */}
          <section>
            <h2 className="text-lg font-semibold text-[#1A1D23] mb-4">{t.categories}</h2>
            <div className="grid grid-cols-2 gap-3">
              {t.categories_list.map((category) => {
                const Icon = category.icon;
                return (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className="p-4 bg-white rounded-xl border border-[#E5E7EB] hover:border-[#1E88E5] transition-colors text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#EFF6FF] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-[#1E88E5]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[#1A1D23] mb-1">
                          {category.title}
                        </h3>
                        <p className="text-xs text-[#6B7280]">
                          {category.articles}{' '}
                          {language === 'sw' ? 'makala' : 'articles'}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* Popular articles */}
          <section>
            <h2 className="text-lg font-semibold text-[#1A1D23] mb-4">{t.popular}</h2>
            <div className="space-y-2">
              {filteredArticles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="w-full p-4 bg-white rounded-xl border border-[#E5E7EB] hover:border-[#1E88E5] transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-[#1A1D23] mb-1 group-hover:text-[#1E88E5] transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-xs text-[#6B7280]">
                        {article.category} • {article.views}{' '}
                        {language === 'sw' ? 'maoni' : 'views'}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#1E88E5] transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Contact support */}
          <section className="pt-4">
            <div className="p-6 bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-2xl">
              <h3 className="text-lg font-semibold text-[#1A1D23] mb-2">
                {t.needMore}
              </h3>
              <p className="text-sm text-[#6B7280] mb-4">
                {language === 'sw'
                  ? 'Timu yetu iko tayari kukusaidia'
                  : 'Our team is ready to help you'}
              </p>
              <Button
                onClick={onContactSupport}
                className="w-full h-12 bg-[#1E88E5] hover:bg-[#1976D2] text-white rounded-xl"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {t.chatSupport}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ArticleView({ article, language, onBack, onContactSupport }: any) {
  const [helpful, setHelpful] = useState<boolean | null>(null);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#FAFBFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-[#1A1D23] rotate-180" />
          </button>
          <div className="flex-1">
            <p className="text-sm text-[#6B7280]">{article.category}</p>
            <h1 className="text-lg font-semibold text-[#1A1D23]">{article.title}</h1>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-80px)] pb-8">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {/* Article content (mock) */}
          <div className="prose prose-sm max-w-none">
            <div className="space-y-4 text-[#1A1D23]">
              <p className="leading-relaxed">
                {language === 'sw'
                  ? 'Hii ni mwongozo wa kina wa jinsi ya kutumia kipengele hiki. Tutakuongoza hatua kwa hatua ili kuhakikisha unaweza kutumia huduma zetu kwa ufanisi.'
                  : 'This is a comprehensive guide on how to use this feature. We\'ll walk you through step by step to ensure you can use our services effectively.'}
              </p>
              <h3 className="text-lg font-semibold mt-6 mb-3">
                {language === 'sw' ? 'Hatua ya 1: Kuanza' : 'Step 1: Getting Started'}
              </h3>
              <p className="leading-relaxed">
                {language === 'sw'
                  ? 'Kwanza, bonyeza kitufe cha kipengele unachotaka kutumia...'
                  : 'First, click on the feature button you want to use...'}
              </p>
              <h3 className="text-lg font-semibold mt-6 mb-3">
                {language === 'sw' ? 'Hatua ya 2: Kumaliza' : 'Step 2: Completing'}
              </h3>
              <p className="leading-relaxed">
                {language === 'sw'
                  ? 'Fuata maagizo yaliyotolewa na kamilisha mchakato...'
                  : 'Follow the provided instructions and complete the process...'}
              </p>
            </div>
          </div>

          {/* Helpful feedback */}
          <div className="p-6 bg-white rounded-2xl border border-[#E5E7EB]">
            <p className="text-center font-medium text-[#1A1D23] mb-4">
              {language === 'sw' ? 'Je, hii imesaidia?' : 'Was this helpful?'}
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => setHelpful(true)}
                variant={helpful === true ? 'default' : 'outline'}
                className={helpful === true ? 'bg-[#43A047] hover:bg-[#2E7D32]' : ''}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {language === 'sw' ? 'Ndiyo' : 'Yes'}
              </Button>
              <Button
                onClick={() => setHelpful(false)}
                variant={helpful === false ? 'default' : 'outline'}
                className={helpful === false ? 'bg-[#EF4444] hover:bg-[#DC2626]' : ''}
              >
                <X className="w-4 h-4 mr-2" />
                {language === 'sw' ? 'Hapana' : 'No'}
              </Button>
            </div>
            {helpful === false && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 pt-4 border-t border-[#E5E7EB]"
              >
                <Button
                  onClick={onContactSupport}
                  variant="outline"
                  className="w-full"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {language === 'sw' ? 'Zungumza na Msaidizi' : 'Chat with Support'}
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}