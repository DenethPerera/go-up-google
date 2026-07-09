const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
// Ensure this path correctly points to your .env file
require('dotenv').config({ path: '.env' });

// Import your Mongoose model
const Category = require('../models/Category');

const seedFromCSV = async () => {
    try {
        // 1. Connect to MongoDB
        if (!process.env.MONGODB_URI) {
            console.error("🔴 MONGODB_URI is missing from your .env file!");
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Successfully connected to MongoDB! 🟢');

        // 2. Locate the CSV file
        const csvPath = path.join(__dirname, 'categories.csv');
        if (!fs.existsSync(csvPath)) {
            console.error(`🔴 Could not find categories.csv at ${csvPath}`);
            process.exit(1);
        }

        const categories = [];
        console.log('Reading categories.csv file... ⏳\n');

        let isFirstRow = true;

        // 3. Read and parse the CSV
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (row) => {
                // --- 🔍 HEADER DETECTOR ---
                if (isFirstRow) {
                    console.log("--- 📋 YOUR CSV HEADERS ---");
                    console.log(Object.keys(row));
                    console.log("---------------------------\n");
                    isFirstRow = false;
                }

                // ⚠️ IMPORTANT: Change 'GCID' and 'en' below to match the exact headers printed above!
                const categoryId = row['categoryId']; 
                const categoryName = row['name']; 

                // Only add to array if both fields exist
                if (categoryId && categoryName) { 
                    categories.push({
                        // Ensure we format the ID properly (some CSVs already include 'categories/', some don't)
                        value: categoryId.startsWith('categories/') ? categoryId : `categories/${categoryId}`,
                        label: categoryName
                    });
                }
            })
            .on('end', async () => {
                if (categories.length === 0) {
                    console.error('🔴 No categories found! Check your column header names in the script.');
                    process.exit(1);
                }

                console.log(`Found ${categories.length} valid categories. Syncing to database... ⏳`);

                // 4. Prepare data for Bulk write
                const bulkOps = categories.map(cat => ({
                    updateOne: {
                        filter: { value: cat.value },
                        update: {
                            $set: {
                                label: cat.label,
                                value: cat.value
                            }
                        },
                        upsert: true // Insert if it doesn't exist, update if it does
                    }
                }));

                // 5. Save to MongoDB
                const result = await Category.bulkWrite(bulkOps);

                console.log(`\n✅ Database Seed Complete!`);
                console.log(`Newly added: ${result.upsertedCount}`);
                console.log(`Updated: ${result.modifiedCount}`);

                process.exit(0);
            });

    } catch (error) {
        console.error('\n🔴 An error occurred:', error.message);
        process.exit(1);
    }
};

// Execute the script
seedFromCSV();