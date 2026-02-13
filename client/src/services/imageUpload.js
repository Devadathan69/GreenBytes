const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dazdmyujy/image/upload";
const UPLOAD_PRESET = "CoFarm";

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
        const response = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Image upload failed');
        }

        const data = await response.json();
        return data.secure_url; // Returns the image URL
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};
