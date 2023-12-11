import type { APIRoute } from 'astro';
import { XataClient, type Organizations, getXataClient } from '../../../xata';
import { organizationSchema } from '../../../schema.ts';
import { Client } from '@googlemaps/google-maps-services-js';

const xata = new XataClient({
  apiKey: import.meta.env.XATA_API_KEY,
  branch: import.meta.env.XATA_BRANCH,
});

export async function GET() {
  try {
    const organizations = await xata.db.organizations.getAll();
    return new Response(
      JSON.stringify({
        organizations,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {}
}

// POST /api/organizations
export const POST: APIRoute = async ({ request }) => {
  const data: unknown = await request.json();
  const result = organizationSchema.safeParse(data);
  let zodErrors = {};

  if (result.success) {
    const locationData = result.data.location;
    const createdLocation = await xata.db.locations.create(locationData);

    // Geocode the address if it exists
    if (createdLocation.address) {
      const args = {
        params: {
          key: import.meta.env.PUBLIC_GOOGLE_API_KEY,
          address: createdLocation.address,
        },
      };
      console.log(args);
      const client = new Client({});
      client.geocode(args).then((gcResponse) => {
        const location = gcResponse.data.results[0].geometry.location;
        const lat = location.lat;
        const lng = location.lng;
        xata.db.locations.update(createdLocation.id, { ...createdLocation, lngLat: location, lat: lat, lng: lng });
      });
    }

    const organizationData = { ...result.data, location: createdLocation.id };
    const createdOrganization = await xata.db.organizations.create(organizationData);

    return new Response(
      JSON.stringify({
        createdOrganization,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  result.error.issues.forEach((issue) => {
    zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
  });

  return new Response(JSON.stringify({ errors: zodErrors }));
};
