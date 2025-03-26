
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, Users, BookOpen, Globe, Shield, Zap } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-xl glass">
      <div className="mb-4 rounded-full bg-umuco-primary/10 p-3 text-umuco-primary dark:bg-umuco-tertiary/10 dark:text-umuco-tertiary">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

export const Features: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: t('home.feature1Title'),
      description: t('home.feature1Desc'),
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: t('home.feature2Title'),
      description: t('home.feature2Desc'),
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: t('home.feature3Title'),
      description: t('home.feature3Desc'),
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Cultural Diversity",
      description: "Access content from various African cultures and regions all in one place",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Trusted Content",
      description: "All courses are verified by cultural experts for authenticity and accuracy",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Offline Learning",
      description: "Download courses to learn on-the-go without constant internet connection",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            {t('home.featuresTitle')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Our platform combines AI-driven personalization with authentic cultural expertise
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
