import * as z from 'zod';

const locationSchema = z.object({
  address: z.string().min(1, { message: 'Address is required' }),
  latitude: z.string().optional(), // Adjust these as needed based on your requirements
  longitude: z.string().optional(),
  description: z.string().optional(),
});

export const organizationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address' }),
  website: z.string().url({ message: 'Invalid URL' }).optional(),
  images: z.array(z.string().url()).optional(), // Assuming URLs for images
  location: locationSchema, // Include the location schema as a nested object
  phone: z
    .string()
    .min(1, { message: 'Phone is required' })
    .regex(/^\d{3}-\d{3}-\d{4}$/, { message: 'Invalid phone format. Format must be XXX-XXX-XXXX' }),
});
