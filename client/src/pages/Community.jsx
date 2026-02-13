import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Community = () => {
    const { t } = useTranslation();
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: "Ram Kumar",
            location: "Punjab",
            content: "My wheat crop is turning yellow at tips. Is this nitrogen deficiency?",
            comments: 3,
            likes: 12,
            time: "2 hours ago"
        },
        {
            id: 2,
            author: "Sita Devi",
            location: "Haryana",
            content: "Best time to sow cotton this year?",
            comments: 5,
            likes: 8,
            time: "5 hours ago"
        }
    ]);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-primary">{t('community')}</h1>
                <button className="bg-primary text-white px-4 py-2 rounded-full font-bold shadow hover:bg-green-700">
                    + Ask Question
                </button>
            </div>

            <div className="space-y-4">
                {posts.map((post) => (
                    <div key={post.id} className="bg-surface p-6 rounded-lg shadow-card">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-gray-800">{post.author}</h3>
                                <span className="text-xs text-gray-500">📍 {post.location}</span>
                            </div>
                            <span className="text-xs text-gray-400">{post.time}</span>
                        </div>

                        <p className="text-gray-700 text-lg mb-4">{post.content}</p>

                        <div className="flex space-x-6 text-gray-500 text-sm font-medium border-t pt-2">
                            <button className="flex items-center space-x-1 hover:text-primary">
                                <span>👍</span> <span>{post.likes} Likes</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-primary">
                                <span>💬</span> <span>{post.comments} Replies</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-primary ml-auto">
                                <span>↗️</span> <span>Share</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Community;
