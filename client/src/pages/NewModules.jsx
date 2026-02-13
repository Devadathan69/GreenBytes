import React from 'react';
import { useTranslation } from 'react-i18next';

export const Calculators = () => {
    const { t } = useTranslation();
    return <div className="p-4"><h1 className="text-2xl font-bold text-primary">{t('calculators')}</h1><p>Fertilizer & Pesticide Calculators coming soon.</p></div>;
};

export const Community = () => {
    const { t } = useTranslation();
    return <div className="p-4"><h1 className="text-2xl font-bold text-primary">{t('community')}</h1><p>Farmer discussions and Q&A.</p></div>;
};

export const Marketplace = () => {
    const { t } = useTranslation();
    return <div className="p-4"><h1 className="text-2xl font-bold text-primary">{t('market')}</h1><p>Buy seeds, tools, and fertilizers.</p></div>;
};

export const News = () => {
    const { t } = useTranslation();
    return <div className="p-4"><h1 className="text-2xl font-bold text-primary">{t('news')}</h1><p>Latest agriculture news and alerts.</p></div>;
};
