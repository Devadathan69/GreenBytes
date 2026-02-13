import React from 'react';
import { useTranslation } from 'react-i18next';

const Marketplace = () => {
    const { t } = useTranslation();

    const products = [
        {
            id: 1,
            name: "DAP Fertilizer",
            category: "Fertilizer",
            price: "₹1,350 / bag",
            seller: "Kisan Kendra, Ludhiana",
            image: "📦"
        },
        {
            id: 2,
            name: "Wheat Seeds (HD 2967)",
            category: "Seeds",
            price: "₹40 / kg",
            seller: "Punjab Agri Store",
            image: "🌾"
        },
        {
            id: 3,
            name: "Knapsack Sprayer",
            category: "Tools",
            price: "₹2,500",
            seller: "Agri Machineries Ltd",
            image: "🎒"
        }
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-primary">{t('market')}</h1>

            {/* Categories */}
            <div className="flex space-x-4 overflow-x-auto pb-2">
                {['All', 'Seeds', 'Fertilizers', 'Tools', 'Pesticides'].map(cat => (
                    <button key={cat} className="px-4 py-2 bg-white border border-gray-200 rounded-full font-medium whitespace-nowrap hover:bg-gray-50">
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map(product => (
                    <div key={product.id} className="bg-surface p-4 rounded-lg shadow-card flex items-start space-x-4">
                        <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-4xl">
                            {product.image}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-800">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                            <p className="text-lg font-bold text-primary">{product.price}</p>
                            <p className="text-xs text-gray-400 mb-3">By {product.seller}</p>
                            <button className="w-full py-2 bg-white border border-primary text-primary font-bold rounded hover:bg-green-50">
                                Contact Seller
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Marketplace;
