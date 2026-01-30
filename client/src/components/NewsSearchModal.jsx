import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000';

const NewsSearchModal = ({ isOpen, onClose, onNewsAdded }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [importingId, setImportingId] = useState(null);
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/api/News/search`, { query }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data && res.data.articles) {
                setResults(res.data.articles);
            }
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (article) => {
        setImportingId(article.url); // Use URL as unique key for loading state
        try {
            const dto = {
                title: article.title,
                description: article.description,
                content: article.content,
                author: article.author || 'Unknown',
                url: article.url,
                urlToImage: article.urlToImage,
                publishedAt: article.publishedAt,
                source: { name: article.source.name }
            };

            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/News/import`, dto, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onNewsAdded(); // Refresh list in parent
        } catch (err) {
            alert('Failed to import article. It might already exist.');
        } finally {
            setImportingId(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-gray-800 dark:text-white">إضافة خبر جديد</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 overflow-y-auto">
                    {/* Actions */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <form onSubmit={handleSearch} className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="ابحث عن أخبار (مثال: Arabian Horse)..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800 border-none p-4 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-500">
                                <i className="fas fa-search"></i>
                            </button>
                        </form>
                        <button
                            onClick={() => { onClose(); navigate('/news/create'); }}
                            className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-4 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        >
                            <i className="fas fa-pen ml-2"></i>
                            كتابة يدوية
                        </button>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    )}

                    {/* Results Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {results.map((article, index) => (
                            <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 flex gap-4 items-start group hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-green-100 dark:hover:border-green-900 transition-all duration-300">
                                <img
                                    src={article.urlToImage || '/placeholder-horse.png'}
                                    alt={article.title}
                                    className="w-24 h-24 rounded-xl object-cover bg-gray-200"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="line-clamp-2 font-bold text-gray-800 dark:text-gray-200 text-sm mb-2 text-left" dir="ltr">
                                        {article.title}
                                    </h3>
                                    <p className="text-xs text-green-600 font-medium mb-1">{article.source.name}</p>
                                    <p className="text-xs text-gray-400">{new Date(article.publishedAt).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => handleImport(article)}
                                    disabled={importingId === article.url}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${importingId === article.url
                                        ? 'bg-gray-200 cursor-wait'
                                        : 'bg-green-500 text-white hover:bg-green-600 hover:scale-110'
                                        }`}
                                >
                                    {importingId === article.url ? (
                                        <i className="fas fa-spinner fa-spin text-gray-500"></i>
                                    ) : (
                                        <i className="fas fa-plus"></i>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsSearchModal;
