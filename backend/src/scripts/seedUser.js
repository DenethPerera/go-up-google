// backend/scripts/seedUser.js
require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const User = require('../models/user.model'); 

// The exact UID from your worker logs
const FIREBASE_UID = 'QXTnsdvnPxMfg9x0WCEWL2Zp5pw2'; 

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Getting fresh Access Token from Google...');
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token'
    });
    
    const accessToken = tokenRes.data.access_token;

    console.log('Fetching Google Business Profile Account ID...');
    const accountRes = await axios.get('https://mybusinessbusinessinformation.googleapis.com/v1/accounts', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const accounts = accountRes.data.accounts;
    if (!accounts || accounts.length === 0) {
      throw new Error('No Google Business accounts found for this Google user.');
    }

    // Usually, the first account is the primary one
    const accountId = accounts[0].name; 
    console.log(`Found GBP Account ID: ${accountId}`);

    console.log(`Saving User ${FIREBASE_UID} to MongoDB...`);
    await User.findOneAndUpdate(
      { firebaseUid: FIREBASE_UID },
      {
        firebaseUid: FIREBASE_UID,
        'oauthTokens.google': {
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
          accessToken: accessToken,
          gbpAccountId: accountId,
          accessTokenExpiresAt: new Date(Date.now() + tokenRes.data.expires_in * 1000)
        }
      },
      { upsert: true, new: true }
    );

    console.log('✅ User seeded successfully! You can now test the Google sync.');
  } catch (error) {
    console.error('❌ Error seeding user:', error.response?.data || error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();