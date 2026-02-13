import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../firebase'; // Real Firestore
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { uploadImage } from '../services/imageUpload';
import { Link } from 'react-router-dom';

const Community = () => {
    const { t } = useTranslation();
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [newPost, setNewPost] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Comments State
    const [activePostId, setActivePostId] = useState(null);
    const [newComment, setNewComment] = useState("");

    // Check LocalStorage Auth
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    // Fetch Posts form Real Firestore
    useEffect(() => {
        const q = query(collection(db, "communityPosts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(postsData);
        });
        return () => unsubscribe();
    }, []);

    // Handle Image Selection
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    // Submit New Post to Real Firestore
    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.trim() && !image) return;

        setLoading(true);
        try {
            let imageUrl = "";
            if (image) {
                try {
                    imageUrl = await uploadImage(image);
                } catch (err) {
                    console.warn("Upload failed, skipping image");
                }
            }

            await addDoc(collection(db, "communityPosts"), {
                authorId: currentUser.uid, // Use Mock UID
                authorName: currentUser.displayName || "Farmer",
                content: newPost,
                imageUrl: imageUrl,
                likes: 0,
                comments: [],
                location: currentUser.location || "Punjab",
                createdAt: serverTimestamp()
            });

            setNewPost("");
            setImage(null);
            setShowModal(false);
        } catch (error) {
            console.error("Error adding post: ", error);
            alert("Failed to post. Check internet connection.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Like (Real Firestore)
    const handleLike = async (postId, currentLikes) => {
        if (!currentUser) return alert("Please Login to Like");
        const postRef = doc(db, "communityPosts", postId);
        await updateDoc(postRef, {
            likes: currentLikes + 1
        });
    };

    // Handle Comment Submit (Real Firestore)
    const handleCommentSubmit = async (postId) => {
        if (!currentUser) return;
        if (!newComment.trim()) return;

        const postRef = doc(db, "communityPosts", postId);
        await updateDoc(postRef, {
            comments: arrayUnion({
                authorId: currentUser.uid,
                authorName: currentUser.displayName || "Farmer",
                text: newComment,
                timestamp: new Date() // Firestore converts JS Date to Timestamp roughly
            })
        });
        setNewComment("");
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-20">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm sticky top-0 z-10 border-b">
                <h1 className="text-2xl font-bold text-primary">{t('community')}</h1>
                {currentUser ? (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-primary text-white px-4 py-2 rounded-full font-bold shadow hover:bg-green-700 transition flex items-center"
                    >
                        <span>➕</span> <span className="ml-2 hidden sm:inline">{t('ask_question')}</span>
                    </button>
                ) : (
                    <Link to="/login" className="text-primary font-bold hover:underline">
                        Login to Post
                    </Link>
                )}
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white p-6 rounded-lg shadow-card">
                        {/* Post Header */}
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                                    {post.authorName?.[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 leading-tight">{post.authorName}</h3>
                                    <span className="text-xs text-gray-500">📍 {post.location}</span>
                                </div>
                            </div>
                            {post.createdAt && (
                                <span className="text-xs text-gray-400">
                                    {/* Handle Firestore Timestamp or JS Date */}
                                    {post.createdAt?.toDate ? new Date(post.createdAt.toDate()).toLocaleDateString() : new Date().toLocaleDateString()}
                                </span>
                            )}
                        </div>

                        {/* Post Content */}
                        <p className="text-gray-800 text-lg mb-4 whitespace-pre-wrap">{post.content}</p>

                        {post.imageUrl && (
                            <img src={post.imageUrl} alt="Post Attachment" className="w-full max-h-96 object-cover rounded-lg mb-4 border border-gray-100 shadow-sm" />
                        )}

                        {/* Actions Bar */}
                        <div className="flex space-x-6 text-gray-500 text-sm font-medium border-t pt-3">
                            <button onClick={() => handleLike(post.id, post.likes)} className="flex items-center space-x-1 hover:text-primary transition group">
                                <span className="group-hover:scale-110 transition">👍</span> <span>{post.likes} Likes</span>
                            </button>
                            <button
                                onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                                className={`flex items-center space-x-1 hover:text-primary transition ${activePostId === post.id ? 'text-primary font-bold' : ''}`}
                            >
                                <span>💬</span> <span>{post.comments?.length || 0} Replies</span>
                            </button>
                        </div>

                        {/* Comments Section */}
                        {activePostId === post.id && (
                            <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50 -mx-6 px-6 -mb-6 pb-6 rounded-b-lg">
                                {/* List Comments */}
                                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                                    {post.comments && post.comments.length > 0 ? (
                                        post.comments.map((comment, index) => (
                                            <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                                                <div className="flex justify-between">
                                                    <span className="font-bold text-xs text-secondary">{comment.authorName}</span>
                                                    <span className="text-xs text-gray-400">
                                                        {comment.timestamp?.seconds ? new Date(comment.timestamp.toDate()).toLocaleDateString() : 'Just now'}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 text-sm mt-1">{comment.text}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400 italic text-center">No replies yet. Be the first!</p>
                                    )}
                                </div>

                                {/* Add Comment Input */}
                                {currentUser ? (
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Write a reply..."
                                            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                        <button
                                            onClick={() => handleCommentSubmit(post.id)}
                                            disabled={!newComment.trim()}
                                            className="bg-primary text-white rounded-full px-4 py-2 font-bold text-sm disabled:opacity-50 hover:bg-green-700 transition"
                                        >
                                            Send
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center text-sm text-gray-500">
                                        <Link to="/login" className="text-primary font-bold hover:underline">Login</Link> to reply
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                {posts.length === 0 && (
                    <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                        <span className="text-4xl block mb-2">🌾</span>
                        <p className="text-gray-500">No discussions yet.</p>
                        <button onClick={() => setShowModal(true)} className="text-primary font-bold mt-2 hover:underline">Start a discussion</button>
                    </div>
                )}
            </div>

            {/* Create Post Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Ask the Community</h2>
                        <form onSubmit={handlePostSubmit}>
                            <textarea
                                className="w-full border rounded p-3 mb-3 h-32 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Describe your crop issue..."
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                required
                            ></textarea>

                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-1">Add Photo (Optional)</label>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                                {image && <p className="text-xs text-green-600 mt-1">✓ Image selected</p>}
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-500 font-bold hover:text-gray-700"
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`bg-primary text-white px-6 py-2 rounded-full font-bold shadow ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
                                >
                                    {loading ? "Posting..." : t('submit')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Community;
