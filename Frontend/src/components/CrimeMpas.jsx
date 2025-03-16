// // import {
// //   Circle,
// //   GoogleMap,
// //   InfoWindow,
// //   Marker,
// //   useJsApiLoader,
// // } from "@react-google-maps/api";
// // import {
// //   AlertTriangle,
// //   Calendar,
// //   Download,
// //   Filter,
// //   Info,
// //   Layers,
// //   Map,
// // } from "lucide-react";
// // import React, { useCallback, useEffect, useRef, useState } from "react";

// // const mapapikey = import.meta.env.VITE_MAP_API_KEY;

// // // Demo crime location data with coordinates for Bangladesh locations
// // function generateCrimeData(limit) {
// //   const crimeTypes = ["Theft", "Assault", "Vandalism", "Robbery", "Cybercrime"];
// //   const locations = [
// //     { name: "Dhaka Central", lat: 23.7104, lng: 90.4074 },
// //     { name: "Chittagong Port", lat: 22.3569, lng: 91.7832 },
// //     { name: "Khulna City", lat: 22.8456, lng: 89.5403 },
// //     { name: "Sylhet Center", lat: 24.8949, lng: 91.8687 },
// //     { name: "Rajshahi University", lat: 24.3636, lng: 88.6241 },
// //   ];
// //   const severities = ["Low", "Medium", "High"];

// //   function getRandomElement(arr) {
// //     return arr[Math.floor(Math.random() * arr.length)];
// //   }

// //   function getRandomDate() {
// //     const startDate = new Date(2025, 2, 1); // March 1, 2025
// //     const endDate = new Date(2025, 2, 31); // March 31, 2025
// //     const randomTime = new Date(
// //       startDate.getTime() +
// //         Math.random() * (endDate.getTime() - startDate.getTime())
// //     );
// //     return randomTime.toISOString().split("T")[0];
// //   }

// //   const demoCrimeData = [];
// //   for (let i = 1; i <= limit; i++) {
// //     const location = getRandomElement(locations);
// //     // Add slight randomization to avoid exact overlaps
// //     const latOffset = (Math.random() - 0.5) * 0.05;
// //     const lngOffset = (Math.random() - 0.5) * 0.05;

// //     demoCrimeData.push({
// //       id: i,
// //       type: getRandomElement(crimeTypes),
// //       location: location.name,
// //       lat: location.lat + latOffset,
// //       lng: location.lng + lngOffset,
// //       severity: getRandomElement(severities),
// //       date: getRandomDate(),
// //     });
// //   }

// //   return demoCrimeData;
// // }

// // // Generate the crime data once outside the component
// // const crimeLocationData = generateCrimeData(100);

// // // Define libraries to load - this helps with caching
// // const libraries = ["places", "visualization"];

// // const CrimeMaps = () => {
// //   // Use the useJsApiLoader hook instead of LoadScript component
// //   const { isLoaded, loadError } = useJsApiLoader({
// //     googleMapsApiKey: mapapikey,
// //     libraries,
// //     // Enable caching by settings this to true
// //     preventGoogleFontsLoading: false,
// //   });

// //   const [mapCenter, setMapCenter] = useState({ lat: 23.8103, lng: 90.4125 }); // Dhaka, Bangladesh
// //   const [zoom, setZoom] = useState(7);
// //   const [typeFilter, setTypeFilter] = useState("all");
// //   const [severityFilter, setSeverityFilter] = useState("all");
// //   const [dateRange, setDateRange] = useState({ start: "", end: "" });
// //   const [crimeData, setCrimeData] = useState(crimeLocationData);
// //   const [filteredCrimeData, setFilteredCrimeData] = useState(crimeLocationData);
// //   const [mapType, setMapType] = useState("markers"); // markers, heatmap
// //   const [showStats, setShowStats] = useState(false);
// //   const [selectedCrime, setSelectedCrime] = useState(null);
// //   const [heatmap, setHeatmap] = useState(null);

// //   // References to store map instances
// //   const mapRef = useRef(null);
// //   const heatmapDataRef = useRef([]);

// //   // Store map instance when it's loaded
// //   const onMapLoad = useCallback((map) => {
// //     mapRef.current = map;
// //   }, []);

// //   // Handle zoom change to adjust heatmap radius
// //   const onZoomChanged = useCallback(() => {
// //     if (mapRef.current && heatmap && mapType === "heatmap") {
// //       const currentZoom = mapRef.current.getZoom();
// //       setZoom(currentZoom);

// //       // Adjust heatmap radius based on zoom level
// //       updateHeatmapRadius(currentZoom);
// //     }
// //   }, [mapType, heatmap]);

// //   // Update heatmap radius based on zoom level
// //   const updateHeatmapRadius = (currentZoom) => {
// //     if (heatmap) {
// //       // Base radius that increases as zoom decreases
// //       const baseRadius = Math.max(20, 50 - currentZoom * 2);
// //       heatmap.set('radius', baseRadius);
// //     }
// //   };

// //   // Get all unique crime types and severities
// //   const allTypes = [
// //     "all",
// //     ...new Set(crimeLocationData.map((crime) => crime.type)),
// //   ];
// //   const allSeverities = [
// //     "all",
// //     ...new Set(crimeLocationData.map((crime) => crime.severity)),
// //   ];

// //   // Filter crime data based on user selections
// //   useEffect(() => {
// //     let filtered = [...crimeData];

// //     // Apply type filter
// //     if (typeFilter !== "all") {
// //       filtered = filtered.filter((crime) => crime.type === typeFilter);
// //     }

// //     // Apply severity filter
// //     if (severityFilter !== "all") {
// //       filtered = filtered.filter((crime) => crime.severity === severityFilter);
// //     }

// //     // Apply date range filter
// //     if (dateRange.start && dateRange.end) {
// //       filtered = filtered.filter((crime) => {
// //         const crimeDate = new Date(crime.date);
// //         const startDate = new Date(dateRange.start);
// //         const endDate = new Date(dateRange.end);
// //         return crimeDate >= startDate && crimeDate <= endDate;
// //       });
// //     }

// //     setFilteredCrimeData(filtered);
// //   }, [typeFilter, severityFilter, dateRange, crimeData]);

// //   // Update heatmap when filtered data changes
// //   useEffect(() => {
// //     if (mapRef.current && window.google && mapType === "heatmap") {
// //       // Remove existing heatmap if it exists
// //       if (heatmap) {
// //         heatmap.setMap(null);
// //       }

// //       // Prepare heatmap data with weights based on severity
// //       const heatmapData = filteredCrimeData.map(crime => {
// //         let weight = 0.3;
// //         if (crime.severity === "Medium") weight = 0.6;
// //         if (crime.severity === "High") weight = 1.0;

// //         return {
// //           location: new window.google.maps.LatLng(crime.lat, crime.lng),
// //           weight: weight
// //         };
// //       });

// //       heatmapDataRef.current = heatmapData;

// //       // Create new heatmap layer with custom gradient
// //       const newHeatmap = new window.google.maps.visualization.HeatmapLayer({
// //         data: heatmapData,
// //         map: mapRef.current,
// //         radius: Math.max(20, 50 - zoom * 2), // Dynamic radius based on zoom
// //         opacity: 0.8,
// //         gradient: [
// //           'rgba(0, 255, 255, 0)',
// //           'rgba(0, 255, 255, 1)',
// //           'rgba(0, 191, 255, 1)',
// //           'rgba(0, 127, 255, 1)',
// //           'rgba(0, 63, 255, 1)',
// //           'rgba(0, 0, 255, 1)',
// //           'rgba(0, 0, 223, 1)',
// //           'rgba(0, 0, 191, 1)',
// //           'rgba(0, 0, 159, 1)',
// //           'rgba(0, 0, 127, 1)',
// //           'rgba(63, 0, 91, 1)',
// //           'rgba(127, 0, 63, 1)',
// //           'rgba(191, 0, 31, 1)',
// //           'rgba(255, 0, 0, 1)'
// //         ]
// //       });

// //       setHeatmap(newHeatmap);
// //     }
// //   }, [filteredCrimeData, mapType, zoom]);

// //   // Toggle between marker and heatmap views
// //   useEffect(() => {
// //     if (mapRef.current && window.google) {
// //       if (mapType === "heatmap") {
// //         // Create heatmap if not already created
// //         if (!heatmap && heatmapDataRef.current.length > 0) {
// //           const newHeatmap = new window.google.maps.visualization.HeatmapLayer({
// //             data: heatmapDataRef.current,
// //             map: mapRef.current,
// //             radius: Math.max(20, 50 - zoom * 2),
// //             opacity: 0.8
// //           });

// //           setHeatmap(newHeatmap);
// //         } else if (heatmap) {
// //           // Show existing heatmap
// //           heatmap.setMap(mapRef.current);
// //         }
// //       } else if (heatmap) {
// //         // Hide heatmap when in marker mode
// //         heatmap.setMap(null);
// //       }
// //     }
// //   }, [mapType, zoom]);

// //   // Get color based on severity
// //   const getSeverityColor = (severity) => {
// //     switch (severity) {
// //       case "High":
// //         return "#EF4444"; // red
// //       case "Medium":
// //         return "#F59E0B"; // amber
// //       case "Low":
// //         return "#10B981"; // green
// //       default:
// //         return "#3B82F6"; // blue
// //     }
// //   };

// //   // Calculate statistics
// //   const getStatistics = () => {
// //     const totalCrimes = filteredCrimeData.length;
// //     const typeCount = {};
// //     const severityCount = {};

// //     filteredCrimeData.forEach((crime) => {
// //       typeCount[crime.type] = (typeCount[crime.type] || 0) + 1;
// //       severityCount[crime.severity] = (severityCount[crime.severity] || 0) + 1;
// //     });

// //     return { totalCrimes, typeCount, severityCount };
// //   };

// //   const stats = getStatistics();

// //   // Google Maps options
// //   const mapOptions = {
// //     mapTypeId: "satellite",
// //     mapTypeControl: true,
// //     mapTypeControlOptions: {
// //       style: 2,
// //       mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain"],
// //     },
// //   };

// //   // Define marker options without using the google object
// //   const getMarkerOptions = (severity) => {
// //     return {
// //       icon: {
// //         url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill="${encodeURIComponent(
// //           getSeverityColor(severity)
// //         )}" stroke="white" stroke-width="2"/></svg>`,
// //         scaledSize: { width: 14, height: 14 },
// //       },
// //     };
// //   };

// //   // Handle errors during map loading
// //   if (loadError) {
// //     return (
// //       <div className="p-6 bg-gray-900 min-h-screen text-gray-100 flex items-center justify-center">
// //         <div className="text-center">
// //           <AlertTriangle className="text-red-400 mx-auto mb-4" size={48} />
// //           <h2 className="text-xl font-bold text-red-300 mb-2">
// //             Error loading maps
// //           </h2>
// //           <p className="text-gray-400">
// //             There was a problem loading Google Maps. Please check your
// //             connection and API key.
// //           </p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
// //       <div className="flex justify-between items-center mb-6">
// //         <div className="flex items-center gap-3">
// //           <AlertTriangle className="text-red-400" size={24} />
// //           <h1 className="text-2xl font-bold text-blue-300">
// //             Crime Maps Bangladesh
// //           </h1>
// //         </div>
// //         <div className="flex space-x-3">
// //           <button
// //             className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
// //               mapType === "markers"
// //                 ? "bg-blue-700 text-white shadow-md"
// //                 : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
// //             }`}
// //             onClick={() => setMapType("markers")}
// //           >
// //             <Map size={18} />
// //             <span>Markers</span>
// //           </button>
// //           <button
// //             className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
// //               mapType === "heatmap"
// //                 ? "bg-blue-700 text-white shadow-md"
// //                 : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
// //             }`}
// //             onClick={() => setMapType("heatmap")}
// //           >
// //             <Layers size={18} />
// //             <span>Heatmap</span>
// //           </button>
// //           <button
// //             className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
// //               showStats
// //                 ? "bg-blue-700 text-white shadow-md"
// //                 : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
// //             }`}
// //             onClick={() => setShowStats(!showStats)}
// //           >
// //             <Info size={18} />
// //             <span>Statistics</span>
// //           </button>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
// //         <div className="lg:col-span-3">
// //           <div className="bg-gray-800 rounded-lg shadow-md p-5 mb-6 border border-gray-700">
// //             <h2 className="text-lg font-semibold mb-4 text-blue-300">
// //               Filter Crimes
// //             </h2>
// //             <div className="flex flex-wrap gap-4">
// //               <div className="flex items-center gap-2">
// //                 <Filter size={16} className="text-gray-400" />
// //                 <select
// //                   className="bg-gray-700 border border-gray-600 text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                   value={typeFilter}
// //                   onChange={(e) => setTypeFilter(e.target.value)}
// //                 >
// //                   {allTypes.map((type) => (
// //                     <option key={type} value={type}>
// //                       {type === "all" ? "All Crime Types" : type}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>

// //               <div className="flex items-center gap-2">
// //                 <select
// //                   className="bg-gray-700 border border-gray-600 text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                   value={severityFilter}
// //                   onChange={(e) => setSeverityFilter(e.target.value)}
// //                 >
// //                   {allSeverities.map((severity) => (
// //                     <option key={severity} value={severity}>
// //                       {severity === "all" ? "All Severity Levels" : severity}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>

// //               <div className="flex items-center gap-2">
// //                 <Calendar size={16} className="text-gray-400" />
// //                 <input
// //                   type="date"
// //                   className="bg-gray-700 border border-gray-600 text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                   value={dateRange.start}
// //                   onChange={(e) =>
// //                     setDateRange((prev) => ({ ...prev, start: e.target.value }))
// //                   }
// //                 />
// //                 <span className="text-gray-400">to</span>
// //                 <input
// //                   type="date"
// //                   className="bg-gray-700 border border-gray-600 text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                   value={dateRange.end}
// //                   onChange={(e) =>
// //                     setDateRange((prev) => ({ ...prev, end: e.target.value }))
// //                   }
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
// //             <div className="h-96 lg:h-[550px]">
// //               {/* Conditionally render the map only when API is loaded */}
// //               {isLoaded ? (
// //                 <GoogleMap
// //                   mapContainerStyle={{ height: "100%", width: "100%" }}
// //                   center={mapCenter}
// //                   zoom={zoom}
// //                   options={mapOptions}
// //                   onLoad={onMapLoad}
// //                   onZoomChanged={onZoomChanged}
// //                 >
// //                   {/* Markers */}
// //                   {mapType === "markers" &&
// //                     filteredCrimeData.map((crime) => (
// //                       <Marker
// //                         key={crime.id}
// //                         position={{ lat: crime.lat, lng: crime.lng }}
// //                         options={getMarkerOptions(crime.severity)}
// //                         onClick={() => setSelectedCrime(crime)}
// //                       />
// //                     ))}

// //                   {/* Info Window for selected crime */}
// //                   {selectedCrime && (
// //                     <InfoWindow
// //                       position={{
// //                         lat: selectedCrime.lat,
// //                         lng: selectedCrime.lng,
// //                       }}
// //                       onCloseClick={() => setSelectedCrime(null)}
// //                     >
// //                       <div className="p-1 bg-white text-gray-900">
// //                         <h3 className="font-bold text-lg">
// //                           {selectedCrime.type}
// //                         </h3>
// //                         <p>
// //                           <strong>Location:</strong> {selectedCrime.location}
// //                         </p>
// //                         <p>
// //                           <strong>Date:</strong>{" "}
// //                           {new Date(selectedCrime.date).toLocaleDateString()}
// //                         </p>
// //                         <p>
// //                           <strong>Severity:</strong>
// //                           <span
// //                             style={{
// //                               color: getSeverityColor(selectedCrime.severity),
// //                             }}
// //                             className="font-semibold"
// //                           >
// //                             {" "}
// //                             {selectedCrime.severity}
// //                           </span>
// //                         </p>
// //                       </div>
// //                     </InfoWindow>
// //                   )}

// //                   {/* We no longer use Circle components for heatmap,
// //                       but we keep this code commented for reference */}
// //                   {/* {mapType === "heatmap" &&
// //                     filteredCrimeData.map((crime) => {
// //                       const radius =
// //                         crime.severity === "High"
// //                           ? 5000
// //                           : crime.severity === "Medium"
// //                           ? 3500
// //                           : 2000;
// //                       const intensity =
// //                         crime.severity === "High"
// //                           ? 0.7
// //                           : crime.severity === "Medium"
// //                           ? 0.5
// //                           : 0.3;

// //                       return (
// //                         <Circle
// //                           key={`circle-${crime.id}`}
// //                           center={{ lat: crime.lat, lng: crime.lng }}
// //                           radius={radius}
// //                           options={{
// //                             fillColor: getSeverityColor(crime.severity),
// //                             fillOpacity: intensity,
// //                             strokeColor: getSeverityColor(crime.severity),
// //                             strokeOpacity: 0.8,
// //                             strokeWeight: 2,
// //                           }}
// //                         />
// //                       );
// //                     })} */}
// //                 </GoogleMap>
// //               ) : (
// //                 // Loading indicator while the map is loading
// //                 <div className="h-full flex items-center justify-center bg-gray-900">
// //                   <div className="text-center">
// //                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
// //                     <p className="text-blue-300">Loading map...</p>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {showStats && (
// //           <div className="lg:col-span-1">
// //             <div className="bg-gray-800 rounded-lg shadow-md p-5 border border-gray-700">
// //               <div className="flex justify-between items-center mb-4">
// //                 <h2 className="text-lg font-semibold text-blue-300">
// //                   Crime Statistics
// //                 </h2>
// //                 <button className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
// //                   <Download size={16} />
// //                   <span>Export</span>
// //                 </button>
// //               </div>

// //               <div className="space-y-5">
// //                 <div className="bg-blue-900 bg-opacity-40 p-4 rounded-lg border border-blue-800">
// //                   <h3 className="text-sm font-medium text-gray-400">
// //                     TOTAL CRIMES
// //                   </h3>
// //                   <p className="text-3xl font-bold text-blue-300">
// //                     {stats.totalCrimes}
// //                   </p>
// //                 </div>

// //                 <div>
// //                   <h3 className="text-sm font-medium text-gray-400 mb-2">
// //                     BY TYPE
// //                   </h3>
// //                   <div className="space-y-2">
// //                     {Object.entries(stats.typeCount).map(([type, count]) => (
// //                       <div
// //                         key={type}
// //                         className="flex justify-between items-center"
// //                       >
// //                         <span className="text-gray-300">{type}</span>
// //                         <div className="flex items-center">
// //                           <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded-md text-xs font-medium">
// //                             {count}
// //                           </span>
// //                           <span className="text-xs text-gray-400 ml-1">
// //                             ({Math.round((count / stats.totalCrimes) * 100)}%)
// //                           </span>
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 <div>
// //                   <h3 className="text-sm font-medium text-gray-400 mb-2">
// //                     BY SEVERITY
// //                   </h3>
// //                   <div className="space-y-2">
// //                     {Object.entries(stats.severityCount).map(
// //                       ([severity, count]) => (
// //                         <div
// //                           key={severity}
// //                           className="flex justify-between items-center"
// //                         >
// //                           <div className="flex items-center">
// //                             <div
// //                               className="w-3 h-3 rounded-full mr-2"
// //                               style={{
// //                                 backgroundColor: getSeverityColor(severity),
// //                               }}
// //                             ></div>
// //                             <span className="text-gray-300">{severity}</span>
// //                           </div>
// //                           <div className="flex items-center">
// //                             <span
// //                               className="px-2 py-1 rounded-md text-xs font-medium text-white"
// //                               style={{
// //                                 backgroundColor: getSeverityColor(severity),
// //                               }}
// //                             >
// //                               {count}
// //                             </span>
// //                             <span className="text-xs text-gray-400 ml-1">
// //                               ({Math.round((count / stats.totalCrimes) * 100)}%)
// //                             </span>
// //                           </div>
// //                         </div>
// //                       )
// //                     )}
// //                   </div>
// //                 </div>

// //                 <div className="pt-3 border-t border-gray-700">
// //                   <p className="text-sm text-gray-400">
// //                     Data last updated: March 16, 2025
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       <div className="mt-6 text-center text-gray-500 text-sm">
// //         © 2025 Bangladesh Surakha Netra. All rights reserved.
// //       </div>
// //     </div>
// //   );
// // };

// // export default CrimeMaps;


// import React, { useEffect, useRef, useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   useMap,
// } from "react-leaflet";
// import HeatmapLayer from "react-leaflet-heatmap-layer";
// import "leaflet/dist/leaflet.css";
// import {
//   AlertTriangle,
//   Calendar,
//   Download,
//   Filter,
//   Info,
//   Layers,
//   Map,
// } from "lucide-react";
// import L from "leaflet";

// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
//   iconUrl: require("leaflet/dist/images/marker-icon.png"),
//   shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
// });

// // Generate demo crime data
// function generateCrimeData(limit) {
//   const crimeTypes = ["Theft", "Assault", "Vandalism", "Robbery", "Cybercrime"];
//   const locations = [
//     { name: "Dhaka Central", lat: 23.7104, lng: 90.4074 },
//     { name: "Chittagong Port", lat: 22.3569, lng: 91.7832 },
//     { name: "Khulna City", lat: 22.8456, lng: 89.5403 },
//     { name: "Sylhet Center", lat: 24.8949, lng: 91.8687 },
//     { name: "Rajshahi University", lat: 24.3636, lng: 88.6241 },
//   ];
//   const severities = ["Low", "Medium", "High"];

//   function getRandomElement(arr) {
//     return arr[Math.floor(Math.random() * arr.length)];
//   }

//   function getRandomDate() {
//     const startDate = new Date(2025, 2, 1);
//     const endDate = new Date(2025, 2, 31);
//     return new Date(
//       startDate.getTime() +
//         Math.random() * (endDate.getTime() - startDate.getTime())
//     )
//       .toISOString()
//       .split("T")[0];
//   }

//   return Array.from({ length: limit }, (_, i) => {
//     const location = getRandomElement(locations);
//     return {
//       id: i + 1,
//       type: getRandomElement(crimeTypes),
//       location: location.name,
//       lat: location.lat + (Math.random() - 0.5) * 0.05,
//       lng: location.lng + (Math.random() - 0.5) * 0.05,
//       severity: getRandomElement(severities),
//       date: getRandomDate(),
//     };
//   });
// }

// const crimeLocationData = generateCrimeData(100);

// const CrimeMaps = () => {
//   const [mapCenter] = useState([23.8103, 90.4125]);
//   const [zoom, setZoom] = useState(13);
//   const [typeFilter, setTypeFilter] = useState("all");
//   const [severityFilter, setSeverityFilter] = useState("all");
//   const [dateRange, setDateRange] = useState({ start: "", end: "" });
//   const [filteredCrimeData, setFilteredCrimeData] = useState(crimeLocationData);
//   const [mapType, setMapType] = useState("markers");
//   const [showStats, setShowStats] = useState(false);
//   const [selectedCrime, setSelectedCrime] = useState(null);
//   const mapRef = useRef(null);

//   useEffect(() => {
//     let filtered = [...crimeLocationData];

//     if (typeFilter !== "all") {
//       filtered = filtered.filter((crime) => crime.type === typeFilter);
//     }

//     if (severityFilter !== "all") {
//       filtered = filtered.filter((crime) => crime.severity === severityFilter);
//     }

//     if (dateRange.start && dateRange.end) {
//       const startDate = new Date(dateRange.start);
//       const endDate = new Date(dateRange.end);
//       filtered = filtered.filter((crime) => {
//         const crimeDate = new Date(crime.date);
//         return crimeDate >= startDate && crimeDate <= endDate;
//       });
//     }

//     setFilteredCrimeData(filtered);
//   }, [typeFilter, severityFilter, dateRange]);

//   const getSeverityColor = (severity) => {
//     switch (severity) {
//       case "High":
//         return "#EF4444";
//       case "Medium":
//         return "#F59E0B";
//       case "Low":
//         return "#10B981";
//       default:
//         return "#3B82F6";
//     }
//   };

//   const getStatistics = () => {
//     const totalCrimes = filteredCrimeData.length;
//     const typeCount = {};
//     const severityCount = {};

//     filteredCrimeData.forEach((crime) => {
//       typeCount[crime.type] = (typeCount[crime.type] || 0) + 1;
//       severityCount[crime.severity] = (severityCount[crime.severity] || 0) + 1;
//     });

//     return { totalCrimes, typeCount, severityCount };
//   };

//   const stats = getStatistics();

//   const heatmapData = filteredCrimeData.map((crime) => {
//     let weight = crime.severity === "High" ? 1.0 : crime.severity === "Medium" ? 0.6 : 0.3;
//     return [crime.lat, crime.lng, weight];
//   });

//   const HeatmapUpdater = () => {
//     const map = useMap();

//     useEffect(() => {
//       if (map) {
//         setZoom(map.getZoom());
//       }
//     }, [map]);

//     return null;
//   };

//   return (
//     <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center gap-3">
//           <AlertTriangle className="text-red-400" size={24} />
//           <h1 className="text-2xl font-bold text-blue-300">Crime Maps Bangladesh</h1>
//         </div>
//       </div>

//       <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
//         <div className="h-96 lg:h-[550px]">
//           <MapContainer center={mapCenter} zoom={zoom} style={{ height: "100%", width: "100%" }} ref={mapRef}>
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//             <HeatmapUpdater />

//             {mapType === "markers" &&
//               filteredCrimeData.map((crime) => (
//                 <Marker key={crime.id} position={[crime.lat, crime.lng]}>
//                   <Popup>
//                     <h3 className="font-bold">{crime.type}</h3>
//                     <p>{crime.location}</p>
//                     <p>{crime.date}</p>
//                     <p style={{ color: getSeverityColor(crime.severity) }}>{crime.severity}</p>
//                   </Popup>
//                 </Marker>
//               ))}

//             {mapType === "heatmap" && (
//               <HeatmapLayer
//                 points={heatmapData}
//                 longitudeExtractor={(m) => m[1]}
//                 latitudeExtractor={(m) => m[0]}
//                 intensityExtractor={(m) => m[2]}
//                 radius={25}
//                 blur={15}
//               />
//             )}
//           </MapContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CrimeMaps;


import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  AlertTriangle,
  Calendar,
  Download,
  Filter,
  Info,
  Layers,
  Map,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// Fix for Leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Demo crime location data with coordinates for Bangladesh locations
function generateCrimeData(limit) {
  const crimeTypes = ["Theft", "Assault", "Vandalism", "Robbery", "Cybercrime"];
  const locations = [
    { name: "Dhaka Central", lat: 23.7104, lng: 90.4074 },
    { name: "Chittagong Port", lat: 22.3569, lng: 91.7832 },
    { name: "Khulna City", lat: 22.8456, lng: 89.5403 },
    { name: "Sylhet Center", lat: 24.8949, lng: 91.8687 },
    { name: "Rajshahi University", lat: 24.3636, lng: 88.6241 },
  ];
  const severities = ["Low", "Medium", "High"];

  function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getRandomDate() {
    const startDate = new Date(2025, 2, 1); // March 1, 2025
    const endDate = new Date(2025, 2, 31); // March 31, 2025
    const randomTime = new Date(
      startDate.getTime() +
        Math.random() * (endDate.getTime() - startDate.getTime())
    );
    return randomTime.toISOString().split("T")[0];
  }

  const demoCrimeData = [];
  for (let i = 1; i <= limit; i++) {
    const location = getRandomElement(locations);
    // Add slight randomization to avoid exact overlaps
    const latOffset = (Math.random() - 0.5) * 0.05;
    const lngOffset = (Math.random() - 0.5) * 0.05;

    demoCrimeData.push({
      id: i,
      type: getRandomElement(crimeTypes),
      location: location.name,
      lat: location.lat + latOffset,
      lng: location.lng + lngOffset,
      severity: getRandomElement(severities),
      date: getRandomDate(),
    });
  }

  return demoCrimeData;
}

const crimeLocationData = generateCrimeData(100);

const CrimeMaps = () => {
  const [mapCenter, setMapCenter] = useState([23.8103, 90.4125]); // Dhaka, Bangladesh
  const [zoom, setZoom] = useState(7);
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [crimeData, setCrimeData] = useState(crimeLocationData);
  const [filteredCrimeData, setFilteredCrimeData] = useState(crimeLocationData);
  const [mapType, setMapType] = useState("markers"); // markers, heatmap
  const [showStats, setShowStats] = useState(false);

  const allTypes = [
    "all",
    ...new Set(crimeLocationData.map((crime) => crime.type)),
  ];
  const allSeverities = [
    "all",
    ...new Set(crimeLocationData.map((crime) => crime.severity)),
  ];

  useEffect(() => {
    let filtered = [...crimeData];

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((crime) => crime.type === typeFilter);
    }

    // Apply severity filter
    if (severityFilter !== "all") {
      filtered = filtered.filter((crime) => crime.severity === severityFilter);
    }

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter((crime) => {
        const crimeDate = new Date(crime.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return crimeDate >= startDate && crimeDate <= endDate;
      });
    }

    setFilteredCrimeData(filtered);
  }, [typeFilter, severityFilter, dateRange, crimeData]);

  // Get color based on severity
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High":
        return "rgba(239, 68, 68, 0.7)"; // red
      case "Medium":
        return "rgba(245, 158, 11, 0.7)"; // amber
      case "Low":
        return "rgba(16, 185, 129, 0.7)"; // green
      default:
        return "rgba(59, 130, 246, 0.7)"; // blue
    }
  };

  // Custom marker icon based on severity
  const getMarkerIcon = (severity) => {
    return L.divIcon({
      className: "custom-div-icon",
      html: `<div style="
        background-color: ${getSeverityColor(severity).replace('0.7', '1')};
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 4px rgba(0,0,0,0.4);
      "></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
  };

  // Calculate statistics
  const getStatistics = () => {
    const totalCrimes = filteredCrimeData.length;
    const typeCount = {};
    const severityCount = {};

    filteredCrimeData.forEach((crime) => {
      typeCount[crime.type] = (typeCount[crime.type] || 0) + 1;
      severityCount[crime.severity] = (severityCount[crime.severity] || 0) + 1;
    });

    return { totalCrimes, typeCount, severityCount };
  };

  const stats = getStatistics();

  // Crime details popup content
  const renderPopupContent = (crime) => (
    <div className="p-1">
      <h3 className="font-bold text-lg">{crime.type}</h3>
      <p>
        <strong>Location:</strong> {crime.location}
      </p>
      <p>
        <strong>Date:</strong>{" "}
        {new Date(crime.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Severity:</strong>
        <span
          style={{
            color: getSeverityColor(crime.severity).replace('0.7','1'),
          }}
          className="font-semibold"
        >
          {" "}
          {crime.severity}
        </span>
      </p>
    </div>
  );

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-red-500" size={24} />
          <h1 className="text-2xl font-bold text-white">
            Crime Maps Bangladesh
          </h1>
        </div>
        <div className="flex space-x-3">
          <button
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
              mapType === "markers"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
            }`}
            onClick={() => setMapType("markers")}
          >
            <Map size={18} />
            <span>Markers</span>
          </button>
          <button
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
              mapType === "heatmap"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
            }`}
            onClick={() => setMapType("heatmap")}
          >
            <Layers size={18} />
            <span>Heatmap</span>
          </button>
          <button
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
              showStats
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
            }`}
            onClick={() => setShowStats(!showStats)}
          >
            <Info size={18} />
            <span>Statistics</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-gray-800 rounded-lg shadow-md p-5 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-300">
              Filter Crimes
            </h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  className="bg-gray-700 border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-300"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  {allTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "all" ? "All Crime Types" : type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select
                  className="bg-gray-700 border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-300"
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                >
                  {allSeverities.map((severity) => (
                    <option key={severity} value={severity}>
                      {severity === "all" ? "All Severity Levels" : severity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <input
                  type="date"
                  className="bg-gray-700 border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-300"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, start: e.target.value }))
                  }
                />
                <span>to</span>
                <input
                  type="date"
                  className="bg-gray-700 border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-300"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="h-96 lg:h-[550px]">
              <MapContainer
                center={mapCenter}
                zoom={zoom}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Always show markers regardless of map type */}
                {filteredCrimeData.map((crime) => (
                  <Marker
                    key={crime.id}
                    position={[crime.lat, crime.lng]}
                    icon={getMarkerIcon(crime.severity)}
                  >
                    <Popup>
                      {renderPopupContent(crime)}
                    </Popup>
                  </Marker>
                ))}

                {/* Add heatmap circles when in heatmap mode */}
                {mapType === "heatmap" &&
                  filteredCrimeData.map((crime) => {
                    const radius =
                      crime.severity === "High"
                        ? 5000
                        : crime.severity === "Medium"
                        ? 3500
                        : 2000;
                    const intensity =
                      crime.severity === "High"
                        ? 0.7
                        : crime.severity === "Medium"
                        ? 0.5
                        : 0.3;

                    return (
                      <Circle
                        key={`circle-${crime.id}`}
                        center={[crime.lat, crime.lng]}
                        radius={radius}
                        pathOptions={{
                          color: getSeverityColor(crime.severity),
                          fillColor: getSeverityColor(crime.severity),
                          fillOpacity: intensity,
                        }}
                      />
                    );
                  })
                }
              </MapContainer>
            </div>
          </div>
        </div>

        {showStats && (
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg shadow-md p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-300">
                  Crime Statistics
                </h2>
                <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  <Download size={16} />
                  <span>Export</span>
                </button>
              </div>

              <div className="space-y-5">
                <div className="bg-blue-900 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-400">
                    TOTAL CRIMES
                  </h3>
                  <p className="text-3xl font-bold text-blue-400">
                    {stats.totalCrimes}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">
                    BY TYPE
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(stats.typeCount).map(([type, count]) => (
                      <div
                        key={type}
                        className="flex justify-between items-center"
                      >
                       <span className="text-gray-300">{type}</span>
                        <div className="flex items-center">
                          <span className="bg-blue-900 text-blue-400 px-2 py-1 rounded-md text-xs font-medium">
                            {count}
                          </span>
                          <span className="text-xs text-gray-400 ml-1">
                            ({Math.round((count / stats.totalCrimes) * 100)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">
                    BY SEVERITY
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(stats.severityCount).map(
                      ([severity, count]) =>(
                        <div
                          key={severity}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{
                                backgroundColor: getSeverityColor(severity).replace('0.7','1'),
                              }}
                            ></div>
                            <span className="text-gray-300">{severity}</span>
                          </div>
                          <div className="flex items-center">
                            <span
                              className="px-2 py-1 rounded-md text-xs font-medium text-white"
                              style={{
                                backgroundColor: getSeverityColor(severity).replace('0.7','1'),
                              }}
                            >
                              {count}
                            </span>
                            <span className="text-xs text-gray-400 ml-1">
                              ({Math.round((count / stats.totalCrimes) * 100)}%)
                            </span>
                          </div>
                        </div>
                      )
                    )}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  Data last updated: March 16, 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

    <div className="mt-6 text-center text-gray-400 text-sm">
      © 2025 Bangladesh Crime Mapping Initiative. All rights reserved.
    </div>
  </div>
);
};

export default CrimeMaps;