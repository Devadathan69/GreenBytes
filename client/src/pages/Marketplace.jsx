import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const PRODUCTS = [
    { id: 1, category: 'fertilizer', name: 'DAP Fertilizer', useCase: 'Boosts phosphorus for root growth and flowering', price: '₹1,350 / 50kg', icon: '🧪' },
    { id: 2, category: 'fertilizer', name: 'Urea (Neem Coated)', useCase: 'Primary nitrogen source for leafy growth', price: '₹266 / 45kg', icon: '🌿' },
    { id: 3, category: 'fertilizer', name: 'Potash (MOP)', useCase: 'Improves fruit quality and disease resistance', price: '₹980 / 50kg', icon: '🧂' },
    { id: 4, category: 'pesticide', name: 'Neem Oil', useCase: 'Natural protection against aphids and whiteflies', price: '₹300 / 1L', icon: '🍃' },
    { id: 5, category: 'pesticide', name: 'Mancozeb', useCase: 'Fungicide for blight and leaf spot control', price: '₹450 / 500g', icon: '🛡️' },
    { id: 6, category: 'pesticide', name: 'Copper Oxychloride', useCase: 'Prevents bacterial and fungal diseases', price: '₹350 / 500g', icon: '💧' },
    { id: 7, category: 'tools', name: 'Knapsack Sprayer', useCase: 'Manual pump sprayer for pesticide application', price: '₹2,200', icon: '💦' },
    { id: 8, category: 'tools', name: 'Pruning Shears', useCase: 'Clean cuts for plant maintenance', price: '₹350', icon: '✂️' },
    { id: 9, category: 'tools', name: 'Soil pH Tester', useCase: 'Quick field testing of soil acidity', price: '₹600', icon: '📊' },
];

const Marketplace = () => {
    const { t } = useTranslation();
    const [filter, setFilter] = useState('all');
    const [orderModal, setOrderModal] = useState(null);
    const [orderConfirmed, setOrderConfirmed] = useState(false);

    const CATEGORIES = [
        { key: 'all', label: t('all_items'), icon: '📦' },
        { key: 'fertilizer', label: t('fertilizers'), icon: '🧪' },
        { key: 'pesticide', label: t('pesticides'), icon: '🛡️' },
        { key: 'tools', label: t('tools'), icon: '🔧' },
    ];

    const filteredProducts = filter === 'all'
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === filter);

    const handleOrder = (product) => {
        setOrderModal(product);
        setOrderConfirmed(false);
    };

    const confirmOrder = () => {
        setOrderConfirmed(true);
        setTimeout(() => {
            setOrderModal(null);
            setOrderConfirmed(false);
        }, 2000);
    };

    return (
        <div className="max-w-xl mx-auto pb-20">
            <h1 className="text-xl font-bold text-gray-800 mb-4">{t('market')}</h1>

            {/* Categories */}
            <div className="flex space-x-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.key}
                        onClick={() => setFilter(cat.key)}
                        className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap flex items-center space-x-1.5 transition active:scale-95 ${filter === cat.key
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-white text-gray-500 border border-gray-100'
                            }`}
                    >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className="space-y-3">
                {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex space-x-3">
                        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                            {product.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-800 text-sm">{product.name}</h3>
                            <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{product.useCase}</p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-primary font-bold text-sm">{product.price}</span>
                                <button
                                    onClick={() => handleOrder(product)}
                                    className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-primary/20 transition active:scale-95"
                                >
                                    {t('order')}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Order Confirmation Modal */}
            {orderModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={() => setOrderModal(null)}>
                    <div className="bg-white w-full max-w-xl rounded-t-2xl p-5 pb-8 shadow-xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
                        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4"></div>

                        {!orderConfirmed ? (
                            <>
                                <div className="text-center mb-4">
                                    <span className="text-4xl block mb-2">{orderModal.icon}</span>
                                    <h3 className="text-lg font-bold text-gray-800">{orderModal.name}</h3>
                                    <p className="text-gray-400 text-sm">{orderModal.useCase}</p>
                                    <p className="text-primary font-bold text-lg mt-2">{orderModal.price}</p>
                                </div>

                                <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                                    <p className="text-xs text-yellow-700">
                                        <span className="font-bold">Note:</span> {t('order_note')}
                                    </p>
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setOrderModal(null)}
                                        className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold active:scale-95"
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button
                                        onClick={confirmOrder}
                                        className="flex-1 py-3 rounded-xl bg-primary text-white font-bold shadow-md active:scale-95"
                                    >
                                        {t('confirm_order')}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-6">
                                <span className="text-5xl block mb-3">✅</span>
                                <h3 className="text-lg font-bold text-gray-800">{t('order_placed')}</h3>
                                <p className="text-gray-400 text-sm mt-1">{t('order_sent')}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
