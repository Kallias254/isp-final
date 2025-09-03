import { buildConfig } from 'payload/config';
import path from 'path';
import { Staff } from './payload-types'; // Import Staff type
import { seed } from './seed';

// Core and Company Collections
import StaffCollection from './collections/Staff'; // Renamed to avoid conflict with type
