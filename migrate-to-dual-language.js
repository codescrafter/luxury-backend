const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elite-models-backend', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schemas for the migration
const yachtSchema = new mongoose.Schema({
  title: String,
  description: String,
  titleEn: String,
  titleAr: String,
  descriptionEn: String,
  descriptionAr: String,
  cancellationPolicy: [String],
  cancellationPolicyEn: [String],
  cancellationPolicyAr: [String],
  termsAndConditions: [String],
  termsAndConditionsEn: [String],
  termsAndConditionsAr: [String],
  city: String,
  cityEn: String,
  cityAr: String,
  region: String,
  regionEn: String,
  regionAr: String,
  country: String,
  countryEn: String,
  countryAr: String,
  address: String,
  addressEn: String,
  addressAr: String,
  tags: [String],
  tagsEn: [String],
  tagsAr: [String],
  // ... other fields
});

const resortSchema = new mongoose.Schema({
  title: String,
  description: String,
  titleEn: String,
  titleAr: String,
  descriptionEn: String,
  descriptionAr: String,
  cancellationPolicy: [String],
  cancellationPolicyEn: [String],
  cancellationPolicyAr: [String],
  termsAndConditions: [String],
  termsAndConditionsEn: [String],
  termsAndConditionsAr: [String],
  safetyFeatures: [String],
  safetyFeaturesEn: [String],
  safetyFeaturesAr: [String],
  amenities: [String],
  amenitiesEn: [String],
  amenitiesAr: [String],
  city: String,
  cityEn: String,
  cityAr: String,
  region: String,
  regionEn: String,
  regionAr: String,
  country: String,
  countryEn: String,
  countryAr: String,
  address: String,
  addressEn: String,
  addressAr: String,
  // ... other fields
});

const jetskiSchema = new mongoose.Schema({
  title: String,
  description: String,
  titleEn: String,
  titleAr: String,
  descriptionEn: String,
  descriptionAr: String,
  cancellationPolicy: [String],
  cancellationPolicyEn: [String],
  cancellationPolicyAr: [String],
  termsAndConditions: [String],
  termsAndConditionsEn: [String],
  termsAndConditionsAr: [String],
  city: String,
  cityEn: String,
  cityAr: String,
  region: String,
  regionEn: String,
  regionAr: String,
  country: String,
  countryEn: String,
  countryAr: String,
  address: String,
  addressEn: String,
  addressAr: String,
  tags: [String],
  tagsEn: [String],
  tagsAr: [String],
  // ... other fields
});

const kayakSchema = new mongoose.Schema({
  title: String,
  description: String,
  titleEn: String,
  titleAr: String,
  descriptionEn: String,
  descriptionAr: String,
  cancellationPolicy: [String],
  cancellationPolicyEn: [String],
  cancellationPolicyAr: [String],
  termsAndConditions: [String],
  termsAndConditionsEn: [String],
  termsAndConditionsAr: [String],
  city: String,
  cityEn: String,
  cityAr: String,
  region: String,
  regionEn: String,
  regionAr: String,
  country: String,
  countryEn: String,
  countryAr: String,
  address: String,
  addressEn: String,
  addressAr: String,
  tags: [String],
  tagsEn: [String],
  tagsAr: [String],
  // ... other fields
});

const speedboatSchema = new mongoose.Schema({
  title: String,
  description: String,
  titleEn: String,
  titleAr: String,
  descriptionEn: String,
  descriptionAr: String,
  cancellationPolicy: [String],
  cancellationPolicyEn: [String],
  cancellationPolicyAr: [String],
  termsAndConditions: [String],
  termsAndConditionsEn: [String],
  termsAndConditionsAr: [String],
  city: String,
  cityEn: String,
  cityAr: String,
  region: String,
  regionEn: String,
  regionAr: String,
  country: String,
  countryEn: String,
  countryAr: String,
  address: String,
  addressEn: String,
  addressAr: String,
  tags: [String],
  tagsEn: [String],
  tagsAr: [String],
  // ... other fields
});

const userSchema = new mongoose.Schema({
  language: { type: String, default: 'en' },
  // ... other fields
});

const Yacht = mongoose.model('Yacht', yachtSchema);
const Resort = mongoose.model('Resort', resortSchema);
const Jetski = mongoose.model('Jetski', jetskiSchema);
const Kayak = mongoose.model('Kayak', kayakSchema);
const Speedboat = mongoose.model('Speedboat', speedboatSchema);
const User = mongoose.model('User', userSchema);

async function migrateToDualLanguage() {
  try {
    console.log('Starting migration to dual-language support...');

    // Update Yachts
    const yachts = await Yacht.find({ titleEn: { $exists: false } });
    console.log(`Found ${yachts.length} yachts to migrate`);
    
    for (const yacht of yachts) {
      await Yacht.updateOne(
        { _id: yacht._id },
        {
          $set: {
            titleEn: yacht.title || 'Default Title',
            titleAr: yacht.title || 'العنوان الافتراضي',
            descriptionEn: yacht.description || 'Default Description',
            descriptionAr: yacht.description || 'الوصف الافتراضي',
            cancellationPolicyEn: yacht.cancellationPolicy || ['Default Policy'],
            cancellationPolicyAr: yacht.cancellationPolicy || ['سياسة افتراضية'],
            termsAndConditionsEn: yacht.termsAndConditions || ['Default Terms'],
            termsAndConditionsAr: yacht.termsAndConditions || ['شروط افتراضية'],
            cityEn: yacht.city || 'Default City',
            cityAr: yacht.city || 'مدينة افتراضية',
            regionEn: yacht.region || 'Default Region',
            regionAr: yacht.region || 'منطقة افتراضية',
            countryEn: yacht.country || 'Default Country',
            countryAr: yacht.country || 'دولة افتراضية',
            addressEn: yacht.address || 'Default Address',
            addressAr: yacht.address || 'عنوان افتراضي',
            tagsEn: yacht.tags || [],
            tagsAr: yacht.tags || [],
          }
        }
      );
    }

    // Update Resorts
    const resorts = await Resort.find({ titleEn: { $exists: false } });
    console.log(`Found ${resorts.length} resorts to migrate`);
    
    for (const resort of resorts) {
      await Resort.updateOne(
        { _id: resort._id },
        {
          $set: {
            titleEn: resort.title || 'Default Title',
            titleAr: resort.title || 'العنوان الافتراضي',
            descriptionEn: resort.description || 'Default Description',
            descriptionAr: resort.description || 'الوصف الافتراضي',
            cancellationPolicyEn: resort.cancellationPolicy || ['Default Policy'],
            cancellationPolicyAr: resort.cancellationPolicy || ['سياسة افتراضية'],
            termsAndConditionsEn: resort.termsAndConditions || ['Default Terms'],
            termsAndConditionsAr: resort.termsAndConditions || ['شروط افتراضية'],
            safetyFeaturesEn: resort.safetyFeatures || ['Default Safety'],
            safetyFeaturesAr: resort.safetyFeatures || ['سلامة افتراضية'],
            amenitiesEn: resort.amenities || ['Default Amenities'],
            amenitiesAr: resort.amenities || ['مرافق افتراضية'],
            cityEn: resort.city || 'Default City',
            cityAr: resort.city || 'مدينة افتراضية',
            regionEn: resort.region || 'Default Region',
            regionAr: resort.region || 'منطقة افتراضية',
            countryEn: resort.country || 'Default Country',
            countryAr: resort.country || 'دولة افتراضية',
            addressEn: resort.address || 'Default Address',
            addressAr: resort.address || 'عنوان افتراضي',
          }
        }
      );
    }

    // Update Jetskis
    const jetskis = await Jetski.find({ titleEn: { $exists: false } });
    console.log(`Found ${jetskis.length} jetskis to migrate`);
    
    for (const jetski of jetskis) {
      await Jetski.updateOne(
        { _id: jetski._id },
        {
          $set: {
            titleEn: jetski.title || 'Default Title',
            titleAr: jetski.title || 'العنوان الافتراضي',
            descriptionEn: jetski.description || 'Default Description',
            descriptionAr: jetski.description || 'الوصف الافتراضي',
            cancellationPolicyEn: jetski.cancellationPolicy || ['Default Policy'],
            cancellationPolicyAr: jetski.cancellationPolicy || ['سياسة افتراضية'],
            termsAndConditionsEn: jetski.termsAndConditions || ['Default Terms'],
            termsAndConditionsAr: jetski.termsAndConditions || ['شروط افتراضية'],
            cityEn: jetski.city || 'Default City',
            cityAr: jetski.city || 'مدينة افتراضية',
            regionEn: jetski.region || 'Default Region',
            regionAr: jetski.region || 'منطقة افتراضية',
            countryEn: jetski.country || 'Default Country',
            countryAr: jetski.country || 'دولة افتراضية',
            addressEn: jetski.address || 'Default Address',
            addressAr: jetski.address || 'عنوان افتراضي',
            tagsEn: jetski.tags || [],
            tagsAr: jetski.tags || [],
          }
        }
      );
    }

    // Update Kayaks
    const kayaks = await Kayak.find({ titleEn: { $exists: false } });
    console.log(`Found ${kayaks.length} kayaks to migrate`);
    
    for (const kayak of kayaks) {
      await Kayak.updateOne(
        { _id: kayak._id },
        {
          $set: {
            titleEn: kayak.title || 'Default Title',
            titleAr: kayak.title || 'العنوان الافتراضي',
            descriptionEn: kayak.description || 'Default Description',
            descriptionAr: kayak.description || 'الوصف الافتراضي',
            cancellationPolicyEn: kayak.cancellationPolicy || ['Default Policy'],
            cancellationPolicyAr: kayak.cancellationPolicy || ['سياسة افتراضية'],
            termsAndConditionsEn: kayak.termsAndConditions || ['Default Terms'],
            termsAndConditionsAr: kayak.termsAndConditions || ['شروط افتراضية'],
            cityEn: kayak.city || 'Default City',
            cityAr: kayak.city || 'مدينة افتراضية',
            regionEn: kayak.region || 'Default Region',
            regionAr: kayak.region || 'منطقة افتراضية',
            countryEn: kayak.country || 'Default Country',
            countryAr: kayak.country || 'دولة افتراضية',
            addressEn: kayak.address || 'Default Address',
            addressAr: kayak.address || 'عنوان افتراضي',
            tagsEn: kayak.tags || [],
            tagsAr: kayak.tags || [],
          }
        }
      );
    }

    // Update Speedboats
    const speedboats = await Speedboat.find({ titleEn: { $exists: false } });
    console.log(`Found ${speedboats.length} speedboats to migrate`);
    
    for (const speedboat of speedboats) {
      await Speedboat.updateOne(
        { _id: speedboat._id },
        {
          $set: {
            titleEn: speedboat.title || 'Default Title',
            titleAr: speedboat.title || 'العنوان الافتراضي',
            descriptionEn: speedboat.description || 'Default Description',
            descriptionAr: speedboat.description || 'الوصف الافتراضي',
            cancellationPolicyEn: speedboat.cancellationPolicy || ['Default Policy'],
            cancellationPolicyAr: speedboat.cancellationPolicy || ['سياسة افتراضية'],
            termsAndConditionsEn: speedboat.termsAndConditions || ['Default Terms'],
            termsAndConditionsAr: speedboat.termsAndConditions || ['شروط افتراضية'],
            cityEn: speedboat.city || 'Default City',
            cityAr: speedboat.city || 'مدينة افتراضية',
            regionEn: speedboat.region || 'Default Region',
            regionAr: speedboat.region || 'منطقة افتراضية',
            countryEn: speedboat.country || 'Default Country',
            countryAr: speedboat.country || 'دولة افتراضية',
            addressEn: speedboat.address || 'Default Address',
            addressAr: speedboat.address || 'عنوان افتراضي',
            tagsEn: speedboat.tags || [],
            tagsAr: speedboat.tags || [],
          }
        }
      );
    }

    // Update Users to have default language
    const users = await User.find({ language: { $exists: false } });
    console.log(`Found ${users.length} users to migrate`);
    
    for (const user of users) {
      await User.updateOne(
        { _id: user._id },
        { $set: { language: 'en' } }
      );
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the migration
migrateToDualLanguage(); 