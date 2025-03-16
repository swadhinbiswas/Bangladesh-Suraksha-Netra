import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, AlertTriangle, Clock, Video } from 'lucide-react';

// Define possible locations in Bangladesh with coordinates
const locations = [
  { name: "Gulshan-1, Dhaka", coordinates: "23.7925°N, 90.4078°E" },
  { name: "Dhanmondi 27, Dhaka", coordinates: "23.7525°N, 90.3742°E" },
  { name: "Uttara Sector 4, Dhaka", coordinates: "23.8728°N, 90.3915°E" },
  { name: "Mirpur 10, Dhaka", coordinates: "23.8069°N, 90.3678°E" },
  { name: "Motijheel, Dhaka", coordinates: "23.7272°N, 90.4093°E" },
  { name: "Banani, Dhaka", coordinates: "23.7937°N, 90.4066°E" },
  { name: "Mohakhali, Dhaka", coordinates: "23.7781°N, 90.4050°E" },
  { name: "Bashundhara, Dhaka", coordinates: "23.8191°N, 90.4459°E" }
];

// Define possible crime types
const crimeTypes = [
  "Theft", "Robbery", "Assault", "Vandalism", "Suspicious Activity",
  "Trespassing", "Harassment", "Public Disturbance", "Drug Activity",
  "Burglary", "Pickpocketing", "Street Fighting", "Vehicle Theft"
];

// Define possible probabilities
const probabilities = ["High", "Medium", "Low"];

// Function to generate random date within the last 24 hours
const generateRandomTimestamp = () => {
  const now = new Date();
  const randomTime = now - Math.floor(Math.random() * 24 * 60 * 60 * 1000);
  const date = new Date(randomTime);

  // Format as YYYY-MM-DD HH:MM
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// Generate crime data entries
const generateCrimeData = (n) => {
  const data = [];
  for (let i = 1; i <= n; i++) {
    // Get random location
    const randomLocationIndex = Math.floor(Math.random() * locations.length);
    const location = locations[randomLocationIndex];

    // Create crime data entry
    data.push({
      id: i,
      location: location.name,
      coordinates: location.coordinates,
      probability: probabilities[Math.floor(Math.random() * probabilities.length)],
      type: crimeTypes[Math.floor(Math.random() * crimeTypes.length)],
      timestamp: generateRandomTimestamp(),
      videoUrl: `/api/placeholder/400/300?id=${i}` // Add ID parameter to differentiate videos
    });
  }
  return data;
};

// Generate 5 random crime entries
const crimeData = generateCrimeData(5);

const ProbabilityBadge = ({ level }) => {
  const colorMap = {
    "High": "bg-red-500 hover:bg-red-600",
    "Medium": "bg-amber-500 hover:bg-amber-600",
    "Low": "bg-green-500 hover:bg-green-600"
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${colorMap[level]}`}>
      {level}
    </span>
  );
};

const PossibleCrimeSpot = () => {
  const [selectedCrime, setSelectedCrime] = useState(crimeData[0]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-700">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-400">Bangladesh Surakha</h1>
            <p className="text-slate-400">Possible Crime Spots</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Crime List */}
          <Card className="lg:col-span-1 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-blue-400">Recent Alerts</CardTitle>
              <CardDescription className="text-slate-400">Possible crime incidents detected by AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {crimeData.map((crime) => (
                  <div
                    key={crime.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedCrime.id === crime.id
                        ? 'bg-blue-900/50 border-blue-500'
                        : 'hover:bg-slate-700 border-slate-600'
                    }`}
                    onClick={() => setSelectedCrime(crime)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-slate-100">{crime.location}</h3>
                      <ProbabilityBadge level={crime.probability} />
                    </div>
                    <div className="flex items-center text-sm text-slate-400 mb-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{crime.coordinates}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <AlertTriangle className="w-4 h-4 mr-1 text-amber-500" />
                      <span className="text-slate-300">{crime.type}</span>
                      <Clock className="w-4 h-4 ml-3 mr-1 text-slate-500" />
                      <span className="text-slate-400">{crime.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Video Display */}
          <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-blue-400">Video Footage</CardTitle>
              <CardDescription className="flex items-center text-slate-400">
                <span>Currently viewing:</span>
                <Badge variant="outline" className="ml-2 border-blue-500 text-blue-400">
                  {selectedCrime.location} - {selectedCrime.type}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <img
                    src={selectedCrime.videoUrl}
                    alt={`Crime footage from ${selectedCrime.location}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="w-16 h-16 text-blue-400 opacity-70" />
                  </div>
                </div>

                <div className="p-4 bg-slate-700 rounded-lg">
                  <h3 className="font-medium mb-2 text-blue-300">Incident Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Location</p>
                      <p className="text-slate-200">{selectedCrime.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Coordinates</p>
                      <p className="text-slate-200">{selectedCrime.coordinates}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Crime Type</p>
                      <p className="text-slate-200">{selectedCrime.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Probability</p>
                      <ProbabilityBadge level={selectedCrime.probability} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Timestamp</p>
                      <p className="text-slate-200">{selectedCrime.timestamp}</p>
                    </div>
                    <div>
                      <Button className="mt-1 bg-blue-600 hover:bg-blue-700" size="sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        Open in Map
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PossibleCrimeSpot;