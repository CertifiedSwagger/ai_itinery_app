import cities from './data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  // If no query, return empty list
  if (!query) {
    return Response.json([]);
  }

  // Filter cities
  const filteredCities = cities
    .filter(city =>
      city.city_ascii.toLowerCase().startsWith(query.toLowerCase())
    )
    .slice(0, 10); // Limit to 10 suggestions

  return Response.json(filteredCities);
}
