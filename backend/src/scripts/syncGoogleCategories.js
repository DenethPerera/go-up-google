const { google } = require('googleapis');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

// Import the Mongoose model
const Category = require('../models/Category');

const syncGoogleCategories = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Successfully connected to MongoDB! 🟢');

        // 1. Initialize OAuth2 Client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI || 'https://developers.google.com/oauthplayground'
        );

        // 2. Pass in the Refresh Token (This never expires)
        if (!process.env.GOOGLE_REFRESH_TOKEN) {
            console.log('Refresh token not found in .env 🔴');
            process.exit(1);
        }

        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        // 3. Initialize the Google Business Profile API
        const businessApi = google.mybusinessbusinessinformation({
            version: 'v1',
            auth: oauth2Client
        });

        console.log('Fetching Categories from Google API... ⏳');

        // 4. Fetch the categories (googleapis handles the access token automatically)
        const response = await businessApi.categories.list({
            languageCode: 'en',
        });

        const categories = response.data.categories;

        if (!categories || categories.length === 0) {
            console.log('No categories found 🔴');
            process.exit(0);
        }

        console.log(`Found ${categories.length} categories. Syncing to database...`);

        // Prepare data for Bulk write
        const bulkOps = categories.map(cat => ({
            updateOne: {
                filter: { value: cat.name }, // e.g., categories/gcid:restaurant
                update: {
                    $set: {
                        label: cat.displayName, 
                        value: cat.name
                    }
                },
                upsert: true 
            }
        }));

        // Save all data to MongoDB at once
        const result = await Category.bulkWrite(bulkOps);

        console.log(`✅ Sync complete!`);
        console.log(`Newly added: ${result.upsertedCount}, Updated: ${result.modifiedCount}`);

        process.exit(0);
    } catch (error) {
        console.error('An error occurred 🔴:', error.message);
        
        // This will print the EXACT reason Google rejected the request
        if (error.response && error.response.data) {
            console.error('Google API Error Details:', error.response.data);
        } else if (error.response) {
            console.error('Status Code:', error.response.status);
        }
        
        process.exit(1);
    }
};

// Execute the script
syncGoogleCategories();