import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw } from 'lucide-react';

const demoIPCameras = [
  { id: 1, name: "Dhaka Central Station", url: "/api/placeholder/640/360", location: "Dhaka", status: "online" },
  { id: 2, name: "Chittagong Port", url: "/api/placeholder/640/360", location: "Chittagong", status: "online" },
  { id: 3, name: "Sylhet City Center", url: "/api/placeholder/640/360", location: "Sylhet", status: "offline" },
  { id: 4, name: "Rajshahi Market", url: "/api/placeholder/640/360", location: "Rajshahi", status: "online" },
  { id: 5, name: "Khulna River Bridge", url: "/api/placeholder/640/360", location: "Khulna", status: "online" },
  { id: 6, name: "Barisal Harbor", url: "/api/placeholder/640/360", location: "Barisal", status: "offline" },
  { id: 7, name: "Cox's Bazar Beach", url: "/api/placeholder/640/360", location: "Cox's Bazar", status: "online" },
  { id: 8, name: "Rangpur Station", url: "/api/placeholder/640/360", location: "Rangpur", status: "online" }
];

const CCTVCams = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cameras, setCameras] = useState(demoIPCameras);
  const [filteredCameras, setFilteredCameras] = useState(demoIPCameras);
  const [viewMode, setViewMode] = useState("grid");

  const locations = ["all", ...new Set(demoIPCameras.map(cam => cam.location))];

  useEffect(() => {
    let filtered = [...cameras];
    if (searchQuery) {
      filtered = filtered.filter(cam =>
        cam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cam.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (locationFilter !== "all") {
      filtered = filtered.filter(cam => cam.location === locationFilter);
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(cam => cam.status === statusFilter);
    }
    setFilteredCameras(filtered);
  }, [searchQuery, locationFilter, statusFilter, cameras]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-400">CCTV Camera Monitoring</h1>
        <div className="flex items-center space-x-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} onClick={() => setViewMode("grid")} className="px-3">
            Grid
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} onClick={() => setViewMode("list")} className="px-3">
            List
          </Button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <Input
              placeholder="Search cameras by name or location..."
              className="pl-10 bg-gray-700 text-white border-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-40 bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white">
                {locations.map(location => (
                  <SelectItem key={location} value={location}>
                    {location === "all" ? "All Locations" : location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2 border-gray-600 text-white">
              <RefreshCw size={16} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow p-6">
        {filteredCameras.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No cameras found matching your filters</p>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "overflow-x-auto"}>
            {filteredCameras.map(camera => (
              <div key={camera.id} className="border border-gray-700 rounded-lg overflow-hidden">
                <div className="relative">
                  <img src={camera.url} alt={camera.name} className="w-full h-48 object-cover" />
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
                    camera.status === "online" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}>
                    {camera.status.toUpperCase()}
                  </div>
                </div>
                <div className="p-3 text-white">
                  <h3 className="font-medium">{camera.name}</h3>
                  <p className="text-sm text-gray-400">{camera.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CCTVCams;
