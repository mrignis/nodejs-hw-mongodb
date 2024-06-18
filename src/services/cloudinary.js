import { v2 as cloudinary } from 'cloudinary';

// IIFE to run the code
(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: 'dmfirtirw', 
        api_key: '433328685741827', 
        api_secret: process.env.CLOUDINARY_API_SECRET // Load API secret from environment variables
    });
    
    try {
        // Upload an image
        const uploadResult = await cloudinary.uploader.upload(
            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', 
            {
                public_id: 'shoes',
            }
        );
        
        console.log('Upload Result:', uploadResult);
        
        // Optimize delivery by resizing and applying auto-format and auto-quality
        const optimizeUrl = cloudinary.url('shoes', {
            fetch_format: 'auto',
            quality: 'auto'
        });
        
        console.log('Optimized URL:', optimizeUrl);
        
        // Transform the image: auto-crop to square aspect_ratio
        const autoCropUrl = cloudinary.url('shoes', {
            crop: 'auto',
            gravity: 'auto',
            width: 500,
            height: 500,
        });
        
        console.log('Auto-Cropped URL:', autoCropUrl);
    } catch (error) {
        console.error('Error:', error);
    }
})();
