import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

const DB_URI = process.env.DB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SUPER_ADMIN_NAME = process.env.SUPER_ADMIN_NAME || 'Super Admin';
const SUPER_ADMIN_PHONE = process.env.SUPER_ADMIN_PHONE || '+10000000000';

if (!DB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    '❌ Missing required environment variables: DB_URI, ADMIN_EMAIL, or ADMIN_PASSWORD',
  );
  process.exit(1);
}

// Define minimal schemas required for seeding to avoid loading entire NestJS app
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    password: { type: String, required: false },
    signInMethod: String,
    role: [{ type: String }],
  },
  { timestamps: true },
);

const userVerificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isSignupCompleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

async function seedAdmin() {
  console.log('🌱 Starting Super Admin seeding process...');

  try {
    await mongoose.connect(DB_URI);
    console.log('✅ Connected to database.');

    const User = mongoose.model('User', userSchema);
    const UserVerification = mongoose.model(
      'UserVerification',
      userVerificationSchema,
    );

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log(
        `✅ Admin with email ${ADMIN_EMAIL} already exists. Skipping seed.`,
      );
      process.exit(0);
    }

    console.log('⏳ Creating Super Admin account...');

    // Hash the password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create the User
    const admin = new User({
      name: SUPER_ADMIN_NAME,
      email: ADMIN_EMAIL,
      phone: SUPER_ADMIN_PHONE,
      password: hashedPassword,
      signInMethod: 'password', // Matching ESignInMethods.PASSWORD
      role: ['admin'], // Matching Role.ADMIN
    });

    const savedAdmin = await admin.save();

    // Create Verification record so they can log in immediately
    await UserVerification.create({
      userId: savedAdmin._id,
      isEmailVerified: true,
      isPhoneVerified: true,
      isSignupCompleted: true,
    });

    console.log(`🎉 Super Admin created successfully!`);
    console.log(`Email: ${ADMIN_EMAIL}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Super Admin:', error);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

seedAdmin();
