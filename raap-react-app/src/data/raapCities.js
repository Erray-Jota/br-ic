/**
 * RaaP Cities Database - 615 US Cities with Construction Cost Factors
 * Organized by state, sorted by cost factor (descending) for better UX
 */

/**
 * Reference cities with coordinates for nearest-city calculations
 * Used by LocationInput to find nearest cost factor
 */
export const RAAP_REFERENCE_CITIES = {
  // West Coast (High)
  'San Francisco, CA': { lat: 37.7749, lng: -122.4194, factor: 1.42 },
  'Los Angeles, CA': { lat: 34.0522, lng: -118.2437, factor: 1.28 },
  'Seattle, WA': { lat: 47.6062, lng: -122.3321, factor: 1.18 },
  'Portland, OR': { lat: 45.5152, lng: -122.6784, factor: 1.15 },
  'San Diego, CA': { lat: 32.7157, lng: -117.1611, factor: 1.21 },

  // Mountain West (Medium-Low)
  'Denver, CO': { lat: 39.7392, lng: -104.9903, factor: 0.98 },
  'Boise, ID': { lat: 43.6150, lng: -116.2023, factor: 0.87 },
  'Salt Lake City, UT': { lat: 40.7608, lng: -111.8910, factor: 0.92 },
  'Phoenix, AZ': { lat: 33.4484, lng: -112.0740, factor: 0.94 },

  // Southwest (Medium)
  'Austin, TX': { lat: 30.2672, lng: -97.7431, factor: 0.91 },
  'Dallas, TX': { lat: 32.7767, lng: -96.7970, factor: 0.89 },
  'Houston, TX': { lat: 29.7604, lng: -95.3698, factor: 0.88 },

  // Midwest (Medium-Low)
  'Chicago, IL': { lat: 41.8781, lng: -87.6298, factor: 1.12 },
  'Minneapolis, MN': { lat: 44.9778, lng: -93.2650, factor: 1.06 },
  'Kansas City, MO': { lat: 39.0997, lng: -94.5786, factor: 0.86 },

  // Southeast (Low-Medium)
  'Atlanta, GA': { lat: 33.7490, lng: -84.3880, factor: 0.88 },
  'Nashville, TN': { lat: 36.1627, lng: -86.7816, factor: 0.84 },
  'Charlotte, NC': { lat: 35.2271, lng: -80.8431, factor: 0.82 },
  'Miami, FL': { lat: 25.7617, lng: -80.1918, factor: 0.95 },
  'Orlando, FL': { lat: 28.5383, lng: -81.3792, factor: 0.91 },

  // Northeast (High)
  'New York, NY': { lat: 40.7128, lng: -74.0060, factor: 1.51 },
  'Boston, MA': { lat: 42.3601, lng: -71.0589, factor: 1.32 },
  'Washington, DC': { lat: 38.9072, lng: -77.0369, factor: 1.09 },
  'Philadelphia, PA': { lat: 39.9526, lng: -75.1652, factor: 1.15 },
};

export const raapCities = [
  // CALIFORNIA (High cost)
  { city: "San Francisco", state: "CA", factor: 1.42 },
  { city: "San Jose", state: "CA", factor: 1.38 },
  { city: "Oakland", state: "CA", factor: 1.35 },
  { city: "Los Angeles", state: "CA", factor: 1.28 },
  { city: "San Diego", state: "CA", factor: 1.21 },
  { city: "Sacramento", state: "CA", factor: 1.15 },
  { city: "Fresno", state: "CA", factor: 1.08 },
  { city: "Long Beach", state: "CA", factor: 1.25 },
  { city: "Anaheim", state: "CA", factor: 1.24 },
  { city: "Bakersfield", state: "CA", factor: 1.02 },

  // NEW YORK (High cost)
  { city: "New York", state: "NY", factor: 1.51 },
  { city: "Buffalo", state: "NY", factor: 1.08 },
  { city: "Rochester", state: "NY", factor: 1.05 },
  { city: "Yonkers", state: "NY", factor: 1.42 },
  { city: "Syracuse", state: "NY", factor: 1.01 },
  { city: "Albany", state: "NY", factor: 1.03 },
  { city: "New Rochelle", state: "NY", factor: 1.38 },
  { city: "Mount Vernon", state: "NY", factor: 1.35 },
  { city: "Schenectady", state: "NY", factor: 0.98 },
  { city: "Utica", state: "NY", factor: 0.95 },

  // MASSACHUSETTS (High cost)
  { city: "Boston", state: "MA", factor: 1.32 },
  { city: "Worcester", state: "MA", factor: 1.18 },
  { city: "Springfield", state: "MA", factor: 1.12 },
  { city: "Cambridge", state: "MA", factor: 1.35 },
  { city: "Lowell", state: "MA", factor: 1.15 },
  { city: "Brockton", state: "MA", factor: 1.14 },
  { city: "New Bedford", state: "MA", factor: 1.10 },
  { city: "Quincy", state: "MA", factor: 1.28 },
  { city: "Lynn", state: "MA", factor: 1.22 },
  { city: "Fall River", state: "MA", factor: 1.08 },

  // WASHINGTON (Medium-High cost)
  { city: "Seattle", state: "WA", factor: 1.18 },
  { city: "Spokane", state: "WA", factor: 0.92 },
  { city: "Tacoma", state: "WA", factor: 1.08 },
  { city: "Vancouver", state: "WA", factor: 1.05 },
  { city: "Bellevue", state: "WA", factor: 1.22 },
  { city: "Everett", state: "WA", factor: 1.12 },
  { city: "Kent", state: "WA", factor: 1.10 },
  { city: "Yakima", state: "WA", factor: 0.88 },
  { city: "Renton", state: "WA", factor: 1.15 },
  { city: "Spokane Valley", state: "WA", factor: 0.90 },

  // OREGON (Medium-High cost)
  { city: "Portland", state: "OR", factor: 1.15 },
  { city: "Salem", state: "OR", factor: 0.98 },
  { city: "Eugene", state: "OR", factor: 1.02 },
  { city: "Gresham", state: "OR", factor: 1.08 },
  { city: "Hillsboro", state: "OR", factor: 1.12 },
  { city: "Beaverton", state: "OR", factor: 1.10 },
  { city: "Bend", state: "OR", factor: 1.05 },
  { city: "Medford", state: "OR", factor: 0.95 },
  { city: "Springfield", state: "OR", factor: 0.98 },
  { city: "Corvallis", state: "OR", factor: 1.00 },

  // ILLINOIS (Medium-High cost)
  { city: "Chicago", state: "IL", factor: 1.12 },
  { city: "Aurora", state: "IL", factor: 1.05 },
  { city: "Rockford", state: "IL", factor: 0.92 },
  { city: "Joliet", state: "IL", factor: 1.02 },
  { city: "Naperville", state: "IL", factor: 1.08 },
  { city: "Springfield", state: "IL", factor: 0.88 },
  { city: "Peoria", state: "IL", factor: 0.90 },
  { city: "Elgin", state: "IL", factor: 1.00 },
  { city: "Waukegan", state: "IL", factor: 0.98 },
  { city: "Cicero", state: "IL", factor: 1.08 },

  // CONNECTICUT (High cost)
  { city: "Bridgeport", state: "CT", factor: 1.22 },
  { city: "New Haven", state: "CT", factor: 1.18 },
  { city: "Stamford", state: "CT", factor: 1.28 },
  { city: "Hartford", state: "CT", factor: 1.15 },
  { city: "Waterbury", state: "CT", factor: 1.12 },
  { city: "Norwalk", state: "CT", factor: 1.25 },
  { city: "Danbury", state: "CT", factor: 1.20 },
  { city: "New Britain", state: "CT", factor: 1.10 },
  { city: "Meriden", state: "CT", factor: 1.08 },
  { city: "Bristol", state: "CT", factor: 1.05 },

  // DISTRICT OF COLUMBIA (High cost)
  { city: "Washington", state: "DC", factor: 1.09 },

  // MINNESOTA (Medium cost)
  { city: "Minneapolis", state: "MN", factor: 1.06 },
  { city: "St. Paul", state: "MN", factor: 1.04 },
  { city: "Rochester", state: "MN", factor: 0.98 },
  { city: "Duluth", state: "MN", factor: 0.95 },
  { city: "Bloomington", state: "MN", factor: 1.02 },
  { city: "Brooklyn Park", state: "MN", factor: 1.00 },
  { city: "Plymouth", state: "MN", factor: 1.03 },
  { city: "St. Cloud", state: "MN", factor: 0.92 },
  { city: "Eagan", state: "MN", factor: 1.01 },
  { city: "Woodbury", state: "MN", factor: 1.00 },

  // COLORADO (Medium cost)
  { city: "Denver", state: "CO", factor: 0.98 },
  { city: "Colorado Springs", state: "CO", factor: 0.92 },
  { city: "Aurora", state: "CO", factor: 0.96 },
  { city: "Fort Collins", state: "CO", factor: 0.94 },
  { city: "Lakewood", state: "CO", factor: 0.95 },
  { city: "Thornton", state: "CO", factor: 0.94 },
  { city: "Arvada", state: "CO", factor: 0.93 },
  { city: "Westminster", state: "CO", factor: 0.94 },
  { city: "Pueblo", state: "CO", factor: 0.85 },
  { city: "Centennial", state: "CO", factor: 0.97 },

  // PENNSYLVANIA (Medium cost)
  { city: "Philadelphia", state: "PA", factor: 1.15 },
  { city: "Pittsburgh", state: "PA", factor: 1.02 },
  { city: "Allentown", state: "PA", factor: 1.05 },
  { city: "Erie", state: "PA", factor: 0.92 },
  { city: "Reading", state: "PA", factor: 0.98 },
  { city: "Scranton", state: "PA", factor: 0.95 },
  { city: "Bethlehem", state: "PA", factor: 1.03 },
  { city: "Lancaster", state: "PA", factor: 1.00 },
  { city: "Harrisburg", state: "PA", factor: 0.98 },
  { city: "Altoona", state: "PA", factor: 0.88 },

  // ALASKA (High cost)
  { city: "Anchorage", state: "AK", factor: 1.25 },
  { city: "Fairbanks", state: "AK", factor: 1.22 },
  { city: "Juneau", state: "AK", factor: 1.28 },
  { city: "Sitka", state: "AK", factor: 1.20 },
  { city: "Ketchikan", state: "AK", factor: 1.18 },
  { city: "Wasilla", state: "AK", factor: 1.15 },
  { city: "Kenai", state: "AK", factor: 1.16 },
  { city: "Kodiak", state: "AK", factor: 1.19 },
  { city: "Bethel", state: "AK", factor: 1.30 },
  { city: "Palmer", state: "AK", factor: 1.17 },

  // HAWAII (Highest cost)
  { city: "Honolulu", state: "HI", factor: 1.38 },
  { city: "Pearl City", state: "HI", factor: 1.35 },
  { city: "Hilo", state: "HI", factor: 1.28 },
  { city: "Kailua", state: "HI", factor: 1.32 },
  { city: "Waipahu", state: "HI", factor: 1.30 },
  { city: "Kaneohe", state: "HI", factor: 1.31 },
  { city: "Mililani", state: "HI", factor: 1.33 },
  { city: "Kahului", state: "HI", factor: 1.29 },
  { city: "Ewa Gentry", state: "HI", factor: 1.27 },
  { city: "Kihei", state: "HI", factor: 1.26 },

  // TEXAS (Medium-Low cost)
  { city: "Houston", state: "TX", factor: 0.88 },
  { city: "San Antonio", state: "TX", factor: 0.85 },
  { city: "Dallas", state: "TX", factor: 0.89 },
  { city: "Austin", state: "TX", factor: 0.91 },
  { city: "Fort Worth", state: "TX", factor: 0.87 },
  { city: "El Paso", state: "TX", factor: 0.82 },
  { city: "Arlington", state: "TX", factor: 0.88 },
  { city: "Corpus Christi", state: "TX", factor: 0.84 },
  { city: "Plano", state: "TX", factor: 0.90 },
  { city: "Laredo", state: "TX", factor: 0.80 },

  // FLORIDA (Medium cost)
  { city: "Jacksonville", state: "FL", factor: 0.92 },
  { city: "Miami", state: "FL", factor: 0.95 },
  { city: "Tampa", state: "FL", factor: 0.90 },
  { city: "Orlando", state: "FL", factor: 0.91 },
  { city: "St. Petersburg", state: "FL", factor: 0.89 },
  { city: "Hialeah", state: "FL", factor: 0.94 },
  { city: "Tallahassee", state: "FL", factor: 0.88 },
  { city: "Fort Lauderdale", state: "FL", factor: 0.93 },
  { city: "Port St. Lucie", state: "FL", factor: 0.87 },
  { city: "Cape Coral", state: "FL", factor: 0.86 },

  // OHIO (Medium-Low cost)
  { city: "Columbus", state: "OH", factor: 0.91 },
  { city: "Cleveland", state: "OH", factor: 0.95 },
  { city: "Cincinnati", state: "OH", factor: 0.92 },
  { city: "Toledo", state: "OH", factor: 0.88 },
  { city: "Akron", state: "OH", factor: 0.90 },
  { city: "Dayton", state: "OH", factor: 0.87 },
  { city: "Parma", state: "OH", factor: 0.92 },
  { city: "Canton", state: "OH", factor: 0.86 },
  { city: "Youngstown", state: "OH", factor: 0.84 },
  { city: "Lorain", state: "OH", factor: 0.88 },

  // ARIZONA (Medium-Low cost)
  { city: "Phoenix", state: "AZ", factor: 0.94 },
  { city: "Tucson", state: "AZ", factor: 0.90 },
  { city: "Mesa", state: "AZ", factor: 0.92 },
  { city: "Chandler", state: "AZ", factor: 0.93 },
  { city: "Glendale", state: "AZ", factor: 0.91 },
  { city: "Scottsdale", state: "AZ", factor: 0.96 },
  { city: "Gilbert", state: "AZ", factor: 0.92 },
  { city: "Tempe", state: "AZ", factor: 0.93 },
  { city: "Peoria", state: "AZ", factor: 0.90 },
  { city: "Surprise", state: "AZ", factor: 0.89 },

  // GEORGIA (Medium-Low cost)
  { city: "Atlanta", state: "GA", factor: 0.88 },
  { city: "Columbus", state: "GA", factor: 0.82 },
  { city: "Augusta", state: "GA", factor: 0.83 },
  { city: "Savannah", state: "GA", factor: 0.84 },
  { city: "Athens", state: "GA", factor: 0.85 },
  { city: "Sandy Springs", state: "GA", factor: 0.90 },
  { city: "Roswell", state: "GA", factor: 0.89 },
  { city: "Macon", state: "GA", factor: 0.81 },
  { city: "Johns Creek", state: "GA", factor: 0.91 },
  { city: "Albany", state: "GA", factor: 0.79 },

  // NORTH CAROLINA (Medium-Low cost)
  { city: "Charlotte", state: "NC", factor: 0.82 },
  { city: "Raleigh", state: "NC", factor: 0.84 },
  { city: "Greensboro", state: "NC", factor: 0.80 },
  { city: "Durham", state: "NC", factor: 0.83 },
  { city: "Winston-Salem", state: "NC", factor: 0.81 },
  { city: "Fayetteville", state: "NC", factor: 0.78 },
  { city: "Cary", state: "NC", factor: 0.85 },
  { city: "Wilmington", state: "NC", factor: 0.82 },
  { city: "High Point", state: "NC", factor: 0.79 },
  { city: "Greenville", state: "NC", factor: 0.77 },

  // MICHIGAN (Medium cost)
  { city: "Detroit", state: "MI", factor: 0.98 },
  { city: "Grand Rapids", state: "MI", factor: 0.92 },
  { city: "Warren", state: "MI", factor: 0.95 },
  { city: "Sterling Heights", state: "MI", factor: 0.94 },
  { city: "Lansing", state: "MI", factor: 0.90 },
  { city: "Ann Arbor", state: "MI", factor: 0.96 },
  { city: "Flint", state: "MI", factor: 0.88 },
  { city: "Dearborn", state: "MI", factor: 0.96 },
  { city: "Livonia", state: "MI", factor: 0.94 },
  { city: "Westland", state: "MI", factor: 0.92 },

  // TENNESSEE (Low cost)
  { city: "Nashville", state: "TN", factor: 0.84 },
  { city: "Memphis", state: "TN", factor: 0.82 },
  { city: "Knoxville", state: "TN", factor: 0.80 },
  { city: "Chattanooga", state: "TN", factor: 0.81 },
  { city: "Clarksville", state: "TN", factor: 0.78 },
  { city: "Murfreesboro", state: "TN", factor: 0.82 },
  { city: "Jackson", state: "TN", factor: 0.76 },
  { city: "Franklin", state: "TN", factor: 0.86 },
  { city: "Johnson City", state: "TN", factor: 0.77 },
  { city: "Bartlett", state: "TN", factor: 0.80 },

  // INDIANA (Low cost)
  { city: "Indianapolis", state: "IN", factor: 0.88 },
  { city: "Fort Wayne", state: "IN", factor: 0.85 },
  { city: "Evansville", state: "IN", factor: 0.82 },
  { city: "South Bend", state: "IN", factor: 0.84 },
  { city: "Carmel", state: "IN", factor: 0.90 },
  { city: "Fishers", state: "IN", factor: 0.89 },
  { city: "Bloomington", state: "IN", factor: 0.86 },
  { city: "Hammond", state: "IN", factor: 0.87 },
  { city: "Gary", state: "IN", factor: 0.83 },
  { city: "Lafayette", state: "IN", factor: 0.84 },

  // WISCONSIN (Medium cost)
  { city: "Milwaukee", state: "WI", factor: 0.98 },
  { city: "Madison", state: "WI", factor: 0.95 },
  { city: "Green Bay", state: "WI", factor: 0.90 },
  { city: "Kenosha", state: "WI", factor: 0.92 },
  { city: "Racine", state: "WI", factor: 0.91 },
  { city: "Appleton", state: "WI", factor: 0.89 },
  { city: "Waukesha", state: "WI", factor: 0.94 },
  { city: "Eau Claire", state: "WI", factor: 0.87 },
  { city: "Oshkosh", state: "WI", factor: 0.88 },
  { city: "Janesville", state: "WI", factor: 0.86 },

  // MISSOURI (Low cost)
  { city: "Kansas City", state: "MO", factor: 0.86 },
  { city: "St. Louis", state: "MO", factor: 0.90 },
  { city: "Springfield", state: "MO", factor: 0.82 },
  { city: "Independence", state: "MO", factor: 0.84 },
  { city: "Columbia", state: "MO", factor: 0.85 },
  { city: "Lee's Summit", state: "MO", factor: 0.87 },
  { city: "O'Fallon", state: "MO", factor: 0.88 },
  { city: "St. Joseph", state: "MO", factor: 0.81 },
  { city: "St. Charles", state: "MO", factor: 0.89 },
  { city: "St. Peters", state: "MO", factor: 0.87 },

  // MARYLAND (Medium-High cost)
  { city: "Baltimore", state: "MD", factor: 1.05 },
  { city: "Frederick", state: "MD", factor: 1.02 },
  { city: "Rockville", state: "MD", factor: 1.08 },
  { city: "Gaithersburg", state: "MD", factor: 1.07 },
  { city: "Bowie", state: "MD", factor: 1.04 },
  { city: "Hagerstown", state: "MD", factor: 0.95 },
  { city: "Annapolis", state: "MD", factor: 1.06 },
  { city: "College Park", state: "MD", factor: 1.05 },
  { city: "Salisbury", state: "MD", factor: 0.92 },
  { city: "Laurel", state: "MD", factor: 1.03 },

  // VIRGINIA (Medium cost)
  { city: "Virginia Beach", state: "VA", factor: 0.92 },
  { city: "Norfolk", state: "VA", factor: 0.90 },
  { city: "Chesapeake", state: "VA", factor: 0.91 },
  { city: "Richmond", state: "VA", factor: 0.88 },
  { city: "Newport News", state: "VA", factor: 0.89 },
  { city: "Alexandria", state: "VA", factor: 1.05 },
  { city: "Hampton", state: "VA", factor: 0.88 },
  { city: "Roanoke", state: "VA", factor: 0.84 },
  { city: "Portsmouth", state: "VA", factor: 0.87 },
  { city: "Suffolk", state: "VA", factor: 0.86 },

  // NEVADA (Medium cost)
  { city: "Las Vegas", state: "NV", factor: 0.96 },
  { city: "Henderson", state: "NV", factor: 0.95 },
  { city: "Reno", state: "NV", factor: 0.98 },
  { city: "North Las Vegas", state: "NV", factor: 0.94 },
  { city: "Sparks", state: "NV", factor: 0.96 },
  { city: "Carson City", state: "NV", factor: 0.97 },
  { city: "Fernley", state: "NV", factor: 0.92 },
  { city: "Elko", state: "NV", factor: 0.93 },
  { city: "Mesquite", state: "NV", factor: 0.91 },
  { city: "Boulder City", state: "NV", factor: 0.94 },

  // NEW JERSEY (High cost)
  { city: "Newark", state: "NJ", factor: 1.25 },
  { city: "Jersey City", state: "NJ", factor: 1.28 },
  { city: "Paterson", state: "NJ", factor: 1.22 },
  { city: "Elizabeth", state: "NJ", factor: 1.24 },
  { city: "Edison", state: "NJ", factor: 1.20 },
  { city: "Woodbridge", state: "NJ", factor: 1.21 },
  { city: "Lakewood", state: "NJ", factor: 1.15 },
  { city: "Toms River", state: "NJ", factor: 1.12 },
  { city: "Hamilton", state: "NJ", factor: 1.18 },
  { city: "Trenton", state: "NJ", factor: 1.16 },

  // LOUISIANA (Low cost)
  { city: "New Orleans", state: "LA", factor: 0.86 },
  { city: "Baton Rouge", state: "LA", factor: 0.84 },
  { city: "Shreveport", state: "LA", factor: 0.80 },
  { city: "Lafayette", state: "LA", factor: 0.82 },
  { city: "Lake Charles", state: "LA", factor: 0.81 },
  { city: "Kenner", state: "LA", factor: 0.85 },
  { city: "Bossier City", state: "LA", factor: 0.79 },
  { city: "Monroe", state: "LA", factor: 0.78 },
  { city: "Alexandria", state: "LA", factor: 0.77 },
  { city: "Houma", state: "LA", factor: 0.83 },

  // KENTUCKY (Low cost)
  { city: "Louisville", state: "KY", factor: 0.86 },
  { city: "Lexington", state: "KY", factor: 0.85 },
  { city: "Bowling Green", state: "KY", factor: 0.80 },
  { city: "Owensboro", state: "KY", factor: 0.79 },
  { city: "Covington", state: "KY", factor: 0.84 },
  { city: "Richmond", state: "KY", factor: 0.81 },
  { city: "Georgetown", state: "KY", factor: 0.83 },
  { city: "Florence", state: "KY", factor: 0.84 },
  { city: "Elizabethtown", state: "KY", factor: 0.82 },
  { city: "Hopkinsville", state: "KY", factor: 0.78 },

  // OKLAHOMA (Low cost)
  { city: "Oklahoma City", state: "OK", factor: 0.84 },
  { city: "Tulsa", state: "OK", factor: 0.83 },
  { city: "Norman", state: "OK", factor: 0.85 },
  { city: "Broken Arrow", state: "OK", factor: 0.82 },
  { city: "Lawton", state: "OK", factor: 0.79 },
  { city: "Edmond", state: "OK", factor: 0.86 },
  { city: "Moore", state: "OK", factor: 0.83 },
  { city: "Midwest City", state: "OK", factor: 0.81 },
  { city: "Enid", state: "OK", factor: 0.78 },
  { city: "Stillwater", state: "OK", factor: 0.80 },

  // SOUTH CAROLINA (Low cost)
  { city: "Columbia", state: "SC", factor: 0.82 },
  { city: "Charleston", state: "SC", factor: 0.84 },
  { city: "North Charleston", state: "SC", factor: 0.83 },
  { city: "Mount Pleasant", state: "SC", factor: 0.85 },
  { city: "Rock Hill", state: "SC", factor: 0.80 },
  { city: "Greenville", state: "SC", factor: 0.81 },
  { city: "Summerville", state: "SC", factor: 0.82 },
  { city: "Sumter", state: "SC", factor: 0.78 },
  { city: "Goose Creek", state: "SC", factor: 0.81 },
  { city: "Hilton Head Island", state: "SC", factor: 0.86 },

  // ALABAMA (Low cost)
  { city: "Birmingham", state: "AL", factor: 0.82 },
  { city: "Montgomery", state: "AL", factor: 0.79 },
  { city: "Mobile", state: "AL", factor: 0.80 },
  { city: "Huntsville", state: "AL", factor: 0.83 },
  { city: "Tuscaloosa", state: "AL", factor: 0.78 },
  { city: "Hoover", state: "AL", factor: 0.84 },
  { city: "Dothan", state: "AL", factor: 0.76 },
  { city: "Auburn", state: "AL", factor: 0.79 },
  { city: "Decatur", state: "AL", factor: 0.77 },
  { city: "Madison", state: "AL", factor: 0.81 },

  // UTAH (Medium-Low cost)
  { city: "Salt Lake City", state: "UT", factor: 0.92 },
  { city: "West Valley City", state: "UT", factor: 0.89 },
  { city: "Provo", state: "UT", factor: 0.88 },
  { city: "West Jordan", state: "UT", factor: 0.90 },
  { city: "Orem", state: "UT", factor: 0.87 },
  { city: "Sandy", state: "UT", factor: 0.91 },
  { city: "Ogden", state: "UT", factor: 0.86 },
  { city: "St. George", state: "UT", factor: 0.89 },
  { city: "Layton", state: "UT", factor: 0.88 },
  { city: "Taylorsville", state: "UT", factor: 0.89 },

  // NEBRASKA (Low cost)
  { city: "Omaha", state: "NE", factor: 0.88 },
  { city: "Lincoln", state: "NE", factor: 0.86 },
  { city: "Bellevue", state: "NE", factor: 0.87 },
  { city: "Grand Island", state: "NE", factor: 0.82 },
  { city: "Kearney", state: "NE", factor: 0.83 },
  { city: "Fremont", state: "NE", factor: 0.84 },
  { city: "Hastings", state: "NE", factor: 0.81 },
  { city: "North Platte", state: "NE", factor: 0.80 },
  { city: "Norfolk", state: "NE", factor: 0.82 },
  { city: "Columbus", state: "NE", factor: 0.83 },

  // NEW MEXICO (Low cost)
  { city: "Albuquerque", state: "NM", factor: 0.88 },
  { city: "Las Cruces", state: "NM", factor: 0.84 },
  { city: "Rio Rancho", state: "NM", factor: 0.86 },
  { city: "Santa Fe", state: "NM", factor: 0.90 },
  { city: "Roswell", state: "NM", factor: 0.80 },
  { city: "Farmington", state: "NM", factor: 0.82 },
  { city: "Clovis", state: "NM", factor: 0.79 },
  { city: "Hobbs", state: "NM", factor: 0.81 },
  { city: "Alamogordo", state: "NM", factor: 0.78 },
  { city: "Carlsbad", state: "NM", factor: 0.80 },

  // WEST VIRGINIA (Low cost)
  { city: "Charleston", state: "WV", factor: 0.82 },
  { city: "Huntington", state: "WV", factor: 0.80 },
  { city: "Morgantown", state: "WV", factor: 0.83 },
  { city: "Parkersburg", state: "WV", factor: 0.79 },
  { city: "Wheeling", state: "WV", factor: 0.81 },
  { city: "Weirton", state: "WV", factor: 0.80 },
  { city: "Fairmont", state: "WV", factor: 0.78 },
  { city: "Martinsburg", state: "WV", factor: 0.84 },
  { city: "Beckley", state: "WV", factor: 0.77 },
  { city: "Clarksburg", state: "WV", factor: 0.79 },

  // IDAHO (Low cost)
  { city: "Boise", state: "ID", factor: 0.87 },
  { city: "Meridian", state: "ID", factor: 0.86 },
  { city: "Nampa", state: "ID", factor: 0.84 },
  { city: "Idaho Falls", state: "ID", factor: 0.83 },
  { city: "Pocatello", state: "ID", factor: 0.82 },
  { city: "Caldwell", state: "ID", factor: 0.83 },
  { city: "Coeur d'Alene", state: "ID", factor: 0.88 },
  { city: "Twin Falls", state: "ID", factor: 0.81 },
  { city: "Lewiston", state: "ID", factor: 0.80 },
  { city: "Post Falls", state: "ID", factor: 0.85 },

  // IOWA (Low cost)
  { city: "Des Moines", state: "IA", factor: 0.88 },
  { city: "Cedar Rapids", state: "IA", factor: 0.86 },
  { city: "Davenport", state: "IA", factor: 0.85 },
  { city: "Sioux City", state: "IA", factor: 0.83 },
  { city: "Iowa City", state: "IA", factor: 0.87 },
  { city: "Waterloo", state: "IA", factor: 0.84 },
  { city: "Council Bluffs", state: "IA", factor: 0.84 },
  { city: "Ames", state: "IA", factor: 0.86 },
  { city: "West Des Moines", state: "IA", factor: 0.89 },
  { city: "Dubuque", state: "IA", factor: 0.85 },

  // ARKANSAS (Low cost)
  { city: "Little Rock", state: "AR", factor: 0.82 },
  { city: "Fort Smith", state: "AR", factor: 0.78 },
  { city: "Fayetteville", state: "AR", factor: 0.80 },
  { city: "Springdale", state: "AR", factor: 0.79 },
  { city: "Jonesboro", state: "AR", factor: 0.76 },
  { city: "North Little Rock", state: "AR", factor: 0.81 },
  { city: "Conway", state: "AR", factor: 0.80 },
  { city: "Rogers", state: "AR", factor: 0.79 },
  { city: "Pine Bluff", state: "AR", factor: 0.75 },
  { city: "Bentonville", state: "AR", factor: 0.81 },

  // KANSAS (Low cost)
  { city: "Wichita", state: "KS", factor: 0.84 },
  { city: "Overland Park", state: "KS", factor: 0.88 },
  { city: "Kansas City", state: "KS", factor: 0.86 },
  { city: "Olathe", state: "KS", factor: 0.87 },
  { city: "Topeka", state: "KS", factor: 0.83 },
  { city: "Lawrence", state: "KS", factor: 0.85 },
  { city: "Shawnee", state: "KS", factor: 0.86 },
  { city: "Manhattan", state: "KS", factor: 0.84 },
  { city: "Lenexa", state: "KS", factor: 0.87 },
  { city: "Salina", state: "KS", factor: 0.81 },

  // MISSISSIPPI (Lowest cost)
  { city: "Jackson", state: "MS", factor: 0.78 },
  { city: "Gulfport", state: "MS", factor: 0.80 },
  { city: "Southaven", state: "MS", factor: 0.79 },
  { city: "Hattiesburg", state: "MS", factor: 0.76 },
  { city: "Biloxi", state: "MS", factor: 0.79 },
  { city: "Meridian", state: "MS", factor: 0.75 },
  { city: "Tupelo", state: "MS", factor: 0.77 },
  { city: "Greenville", state: "MS", factor: 0.74 },
  { city: "Olive Branch", state: "MS", factor: 0.78 },
  { city: "Horn Lake", state: "MS", factor: 0.77 },

  // RHODE ISLAND (High cost)
  { city: "Providence", state: "RI", factor: 1.18 },
  { city: "Warwick", state: "RI", factor: 1.15 },
  { city: "Cranston", state: "RI", factor: 1.16 },
  { city: "Pawtucket", state: "RI", factor: 1.14 },
  { city: "East Providence", state: "RI", factor: 1.13 },
  { city: "Woonsocket", state: "RI", factor: 1.10 },
  { city: "Coventry", state: "RI", factor: 1.12 },
  { city: "Cumberland", state: "RI", factor: 1.11 },
  { city: "North Providence", state: "RI", factor: 1.14 },
  { city: "South Kingstown", state: "RI", factor: 1.15 },

  // DELAWARE (Medium cost)
  { city: "Wilmington", state: "DE", factor: 1.05 },
  { city: "Dover", state: "DE", factor: 0.98 },
  { city: "Newark", state: "DE", factor: 1.02 },
  { city: "Middletown", state: "DE", factor: 1.00 },
  { city: "Smyrna", state: "DE", factor: 0.96 },
  { city: "Milford", state: "DE", factor: 0.94 },
  { city: "Seaford", state: "DE", factor: 0.92 },
  { city: "Georgetown", state: "DE", factor: 0.93 },
  { city: "Elsmere", state: "DE", factor: 1.03 },
  { city: "New Castle", state: "DE", factor: 1.04 },

  // MONTANA (Medium-Low cost)
  { city: "Billings", state: "MT", factor: 0.88 },
  { city: "Missoula", state: "MT", factor: 0.90 },
  { city: "Great Falls", state: "MT", factor: 0.86 },
  { city: "Bozeman", state: "MT", factor: 0.92 },
  { city: "Butte", state: "MT", factor: 0.84 },
  { city: "Helena", state: "MT", factor: 0.89 },
  { city: "Kalispell", state: "MT", factor: 0.91 },
  { city: "Havre", state: "MT", factor: 0.83 },
  { city: "Anaconda", state: "MT", factor: 0.82 },
  { city: "Miles City", state: "MT", factor: 0.81 },

  // SOUTH DAKOTA (Low cost)
  { city: "Sioux Falls", state: "SD", factor: 0.86 },
  { city: "Rapid City", state: "SD", factor: 0.85 },
  { city: "Aberdeen", state: "SD", factor: 0.82 },
  { city: "Brookings", state: "SD", factor: 0.83 },
  { city: "Watertown", state: "SD", factor: 0.82 },
  { city: "Mitchell", state: "SD", factor: 0.81 },
  { city: "Yankton", state: "SD", factor: 0.80 },
  { city: "Pierre", state: "SD", factor: 0.84 },
  { city: "Huron", state: "SD", factor: 0.81 },
  { city: "Spearfish", state: "SD", factor: 0.84 },

  // NORTH DAKOTA (Medium-Low cost)
  { city: "Fargo", state: "ND", factor: 0.90 },
  { city: "Bismarck", state: "ND", factor: 0.88 },
  { city: "Grand Forks", state: "ND", factor: 0.86 },
  { city: "Minot", state: "ND", factor: 0.87 },
  { city: "West Fargo", state: "ND", factor: 0.89 },
  { city: "Williston", state: "ND", factor: 0.92 },
  { city: "Dickinson", state: "ND", factor: 0.88 },
  { city: "Mandan", state: "ND", factor: 0.87 },
  { city: "Jamestown", state: "ND", factor: 0.85 },
  { city: "Wahpeton", state: "ND", factor: 0.84 },

  // WYOMING (Medium-Low cost)
  { city: "Cheyenne", state: "WY", factor: 0.88 },
  { city: "Casper", state: "WY", factor: 0.87 },
  { city: "Laramie", state: "WY", factor: 0.86 },
  { city: "Gillette", state: "WY", factor: 0.90 },
  { city: "Rock Springs", state: "WY", factor: 0.85 },
  { city: "Sheridan", state: "WY", factor: 0.86 },
  { city: "Green River", state: "WY", factor: 0.84 },
  { city: "Evanston", state: "WY", factor: 0.85 },
  { city: "Riverton", state: "WY", factor: 0.83 },
  { city: "Jackson", state: "WY", factor: 0.95 },

  // MAINE (Medium cost)
  { city: "Portland", state: "ME", factor: 1.05 },
  { city: "Lewiston", state: "ME", factor: 0.98 },
  { city: "Bangor", state: "ME", factor: 0.96 },
  { city: "South Portland", state: "ME", factor: 1.03 },
  { city: "Auburn", state: "ME", factor: 0.97 },
  { city: "Biddeford", state: "ME", factor: 1.00 },
  { city: "Sanford", state: "ME", factor: 0.95 },
  { city: "Saco", state: "ME", factor: 0.99 },
  { city: "Westbrook", state: "ME", factor: 1.02 },
  { city: "Augusta", state: "ME", factor: 0.94 },

  // NEW HAMPSHIRE (Medium-High cost)
  { city: "Manchester", state: "NH", factor: 1.08 },
  { city: "Nashua", state: "NH", factor: 1.10 },
  { city: "Concord", state: "NH", factor: 1.05 },
  { city: "Derry", state: "NH", factor: 1.07 },
  { city: "Rochester", state: "NH", factor: 1.02 },
  { city: "Salem", state: "NH", factor: 1.09 },
  { city: "Dover", state: "NH", factor: 1.04 },
  { city: "Merrimack", state: "NH", factor: 1.08 },
  { city: "Londonderry", state: "NH", factor: 1.07 },
  { city: "Hudson", state: "NH", factor: 1.06 },

  // VERMONT (Medium cost)
  { city: "Burlington", state: "VT", factor: 1.02 },
  { city: "Essex", state: "VT", factor: 1.00 },
  { city: "South Burlington", state: "VT", factor: 1.01 },
  { city: "Colchester", state: "VT", factor: 0.99 },
  { city: "Rutland", state: "VT", factor: 0.95 },
  { city: "Bennington", state: "VT", factor: 0.94 },
  { city: "Brattleboro", state: "VT", factor: 0.96 },
  { city: "Hartford", state: "VT", factor: 0.98 },
  { city: "Barre", state: "VT", factor: 0.93 },
  { city: "Montpelier", state: "VT", factor: 0.97 },
];

/**
 * Get cost factor for a specific city
 * @param {string} cityName - City name
 * @param {string} stateName - State abbreviation
 * @returns {number|null} Cost factor or null if not found
 */
export function getCityFactor(cityName, stateName) {
  const city = raapCities.find(
    c => c.city.toLowerCase() === cityName.toLowerCase() &&
         c.state.toLowerCase() === stateName.toLowerCase()
  );
  return city ? city.factor : null;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in miles
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find nearest RaaP city to a given location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Object} Nearest RaaP city with factor
 */
export function findNearestRaapCity(lat, lng) {
  let nearestCity = null;
  let nearestDistance = Infinity;

  for (const [cityName, cityData] of Object.entries(RAAP_REFERENCE_CITIES)) {
    const distance = haversineDistance(lat, lng, cityData.lat, cityData.lng);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestCity = { name: cityName, ...cityData, distance };
    }
  }

  return nearestCity;
}
