import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../models/User.js';
import WebsiteContent from '../models/WebsiteContent.js';
import GalleryItem from '../models/GalleryItem.js';
import Announcement from '../models/Announcement.js';
import Event from '../models/Event.js';
import Cause from '../models/Cause.js';
import {
  isCloudinaryConfigured,
  isCloudinaryUrl,
  uploadImageToCloudinary,
} from '../utils/cloudinaryService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const dryRun = process.argv.includes('--dry-run');
const STOCK_PLACEHOLDER_FRAGMENT = 'photo-1535713875002-d1d0cf377fde';

const curatedGallerySeeds = [
  {
    title: 'Kotilingala Ghat Weekend Cleanup Drive',
    category: 'River Cleaning',
    location: 'Kotilingala Ghat, Rajahmundry',
    dateLabel: 'October 2026',
    file: 'gallery-clean-kotilingala.jpg',
  },
  {
    title: 'Mass Native Sapling Plantation on Riverbank',
    category: 'Plantation',
    location: 'Godavari Bund Road',
    dateLabel: 'October 2026',
    file: 'gallery-plant-bund.jpg',
  },
  {
    title: 'Paryavarana Community Pledge & Rally',
    category: 'Awareness',
    location: 'Rajahmundry Municipal Grounds',
    dateLabel: 'September 2026',
    file: 'gallery-aware-pledge.jpg',
  },
  {
    title: 'Green Future Sapling Care Initiative',
    category: 'Plantation',
    location: 'Pushkar Ghat Nursery',
    dateLabel: 'September 2026',
    file: 'hero-plant.jpg',
  },
  {
    title: 'Plastic Interception & Waste Segregation',
    category: 'River Cleaning',
    location: 'Saraswathi Ghat',
    dateLabel: 'September 2026',
    file: 'gallery-clean-sorting.jpg',
  },
  {
    title: 'Riverbank Green Corridor Development',
    category: 'Plantation',
    location: 'Kovvur Riverbank',
    dateLabel: 'August 2026',
    file: 'gallery-plant-corridor.jpg',
  },
  {
    title: 'Morning Ecological Survey at Dowleswaram',
    category: 'Events',
    location: 'Dowleswaram Barrage',
    dateLabel: 'August 2026',
    file: 'gallery-conserve-dowleswaram.jpg',
  },
  {
    title: 'Pristine Riverfront Water Sampling',
    category: 'Events',
    location: 'Havelock Bridge Viewpoint',
    dateLabel: 'September 2026',
    file: 'gallery-conserve-sampling.jpg',
  },
  {
    title: 'School Youth River Stewardship Workshop',
    category: 'Awareness',
    location: 'Pushkar Ghat Community Hall',
    dateLabel: 'September 2026',
    file: 'gallery-aware-school.jpg',
  },
];

const needsMigration = (val) => {
  if (!val || typeof val !== 'string') return false;
  const trimmed = val.trim();
  if (!trimmed) return false;
  if (isCloudinaryUrl(trimmed)) return false;
  return trimmed.startsWith('data:image/') || /^https?:\/\//i.test(trimmed);
};

const describeValue = (val) => {
  if (!val) return '(empty)';
  if (val.startsWith('data:image/')) return `data:image blob (${val.length} chars)`;
  return val.slice(0, 90);
};

const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing in backend/.env');
  }
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary credentials are missing in backend/.env');
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Connected to MongoDB${dryRun ? ' (DRY RUN)' : ''}.`);

  const stats = {
    checked: 0,
    migrated: 0,
    clearedPlaceholders: 0,
    gallerySeeded: 0,
    failed: 0,
    skippedCloudinary: 0,
  };

  const migrateField = async (doc, field, folder, extraUpdate = {}) => {
    const val = doc[field];
    if (!val || typeof val !== 'string' || !val.trim()) return;
    stats.checked += 1;

    if (field === 'avatar' && val.includes(STOCK_PLACEHOLDER_FRAGMENT)) {
      console.log(` -> [User ${doc._id}.avatar] clearing legacy stock placeholder`);
      if (!dryRun) {
        doc.avatar = '';
        await doc.save();
        stats.clearedPlaceholders += 1;
      }
      return;
    }

    if (isCloudinaryUrl(val)) {
      stats.skippedCloudinary += 1;
      return;
    }

    if (!needsMigration(val)) return;

    console.log(` -> [${doc.constructor.modelName} ${doc._id}.${field}] ${describeValue(val)}`);
    if (dryRun) return;

    try {
      let uploadInput = val;
      if (/^https?:\/\//i.test(val)) {
        const remoteRes = await fetch(val, { signal: AbortSignal.timeout(10000) });
        if (!remoteRes.ok) {
          throw new Error(`HTTP ${remoteRes.status} fetching source image`);
        }
        const contentType = remoteRes.headers.get('content-type') || 'image/jpeg';
        const arrBuf = await remoteRes.arrayBuffer();
        uploadInput = `data:${contentType};base64,${Buffer.from(arrBuf).toString('base64')}`;
      }
      const uploaded = await uploadImageToCloudinary(uploadInput, { folder });
      doc[field] = uploaded.url;
      for (const [k, makeVal] of Object.entries(extraUpdate)) {
        doc[k] = makeVal(uploaded);
      }
      await doc.save();
      stats.migrated += 1;
      console.log(`    Migrated -> ${uploaded.url}`);
    } catch (err) {
      stats.failed += 1;
      console.error(`    Failed (${doc.constructor.modelName} ${doc._id}.${field}): ${err.message}`);
    }
  };

  const users = await User.find({ avatar: { $exists: true, $ne: '' } });
  for (const u of users) await migrateField(u, 'avatar', 'avatars');

  const contents = await WebsiteContent.find({ logoUrl: { $exists: true, $ne: '' } });
  for (const c of contents) await migrateField(c, 'logoUrl', 'branding');

  const gallery = await GalleryItem.find({ imageUrl: { $exists: true, $ne: '' } });
  for (const g of gallery) {
    await migrateField(g, 'imageUrl', 'gallery', {
      cloudinaryPublicId: (up) => up.publicId || '',
    });
  }

  const announcements = await Announcement.find({});
  for (const a of announcements) {
    if (a.imageUrl) await migrateField(a, 'imageUrl', 'announcements');
    if (a.attachmentUrl && a.attachmentUrl.startsWith('data:image/')) {
      await migrateField(a, 'attachmentUrl', 'announcements');
    }
  }

  const events = await Event.find({ bannerImage: { $exists: true, $ne: '' } });
  for (const ev of events) await migrateField(ev, 'bannerImage', 'events');

  const causes = await Cause.find({ imageUrl: { $exists: true, $ne: '' } });
  for (const ca of causes) await migrateField(ca, 'imageUrl', 'causes');

  // Seed present curated gallery photos from frontend/src/assets into Cloudinary + MongoDB if missing
  const assetsDir = path.resolve(__dirname, '../../../frontend/src/assets');
  const adminUser = await User.findOne({ email: 'admin@gmail.com' }).select('_id');

  for (const item of curatedGallerySeeds) {
    const existing = await GalleryItem.findOne({ title: item.title });
    if (existing) continue;

    const filePath = path.join(assetsDir, item.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`Asset not found: ${filePath}`);
      continue;
    }

    console.log(` -> [Curated Gallery] "${item.title}" (${item.file})`);
    if (dryRun) continue;

    try {
      const ext = path.extname(item.file).toLowerCase() === '.png' ? 'png' : 'jpeg';
      const base64DataUri = `data:image/${ext};base64,${fs.readFileSync(filePath).toString('base64')}`;
      const uploaded = await uploadImageToCloudinary(base64DataUri, { folder: 'gallery' });
      await GalleryItem.create({
        title: item.title,
        category: item.category,
        imageUrl: uploaded.url,
        cloudinaryPublicId: uploaded.publicId || '',
        location: item.location,
        dateLabel: item.dateLabel,
        createdBy: adminUser?._id,
      });
      stats.gallerySeeded += 1;
      console.log(`    Stored -> ${uploaded.url}`);
    } catch (err) {
      stats.failed += 1;
      console.error(`    Failed seeding "${item.title}": ${err.message}`);
    }
  }

  console.log('Summary:', stats);
  await mongoose.disconnect();
};

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration error:', err);
    process.exit(1);
  });
