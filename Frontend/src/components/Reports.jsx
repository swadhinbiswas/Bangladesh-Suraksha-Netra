import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, Filter, Download, Calendar, Map, BarChart2, List, TrendingUp, AlertCircle } from 'lucide-react';


function generateCrimeData(limit) {
  const crimeTypes = ["Theft", "Assault", "Vandalism", "Robbery", "Cybercrime"];
  const locations = [
      "Dhaka North", "Chittagong Central", "Sylhet", "Rajshahi", "Khulna",
      "Dhaka South", "Barisal", "Rangpur", "Dhaka East", "Chittagong South"
  ];
  const statuses = ["Resolved", "Under Investigation", "Pending"];

  function getRandomElement(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
  }

  function getRandomDate() {
      const startDate = new Date(2025, 2, 1); // March 1, 2025
      const endDate = new Date(2025, 2, 31); // March 31, 2025
      const randomTime = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      const date = randomTime.toISOString().split("T")[0];
      const time = `${randomTime.getHours().toString().padStart(2, '0')}:${randomTime.getMinutes().toString().padStart(2, '0')}`;
      return { date, time };
  }

  const CrimeData = [];
  for (let i = 1; i <= limit; i++) {
      const { date, time } = getRandomDate();
      CrimeData.push({
          id: i,
          type: getRandomElement(crimeTypes),
          location: getRandomElement(locations),
          date: date,
          time: time,
          status: getRandomElement(statuses),
          details: `Crime reported in ${getRandomElement(locations)}`
      });
  }

  return CrimeData;
}


const demoCrimeData = generateCrimeData(100);


// Color palette - Updated for dark blue theme
const COLORS = {
  theft: '#60A5FA',
  assault: '#F87171',
  vandalism: '#A78BFA',
  robbery: '#FBBF24',
  cybercrime: '#34D399',
  resolved: '#34D399',
  pending: '#FBBF24',
  investigation: '#818CF8',
  background: '#111827',
  backgroundAlt: '#1F2937',
  accent: '#3B82F6',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
};

const PIE_COLORS = ['#60A5FA', '#F87171', '#34D399', '#FBBF24', '#A78BFA', '#EC4899'];

// Prepare chart data
const aggregateDataByType = (data) => {
  const counts = {};
  data.forEach(crime => {
    counts[crime.type] = (counts[crime.type] || 0) + 1;
  });

  return Object.keys(counts).map(type => ({
    name: type,
    value: counts[type]
  }));
};

const aggregateDataByLocation = (data) => {
  const counts = {};
  data.forEach(crime => {
    counts[crime.location] = (counts[crime.location] || 0) + 1;
  });

  return Object.keys(counts).map(location => ({
    name: location,
    value: counts[location]
  })).sort((a, b) => b.value - a.value);
};

const aggregateDataByStatus = (data) => {
  const counts = {};
  data.forEach(crime => {
    counts[crime.status] = (counts[crime.status] || 0) + 1;
  });

  return Object.keys(counts).map(status => ({
    name: status,
    value: counts[status]
  }));
};

const Reports = ({ crimeData = demoCrimeData }) => { // Added default parameter
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [reports, setReports] = useState(crimeData);
  const [filteredReports, setFilteredReports] = useState(crimeData);
  const [activeTab, setActiveTab] = useState("reports"); // reports, analytics

  // Get unique types and statuses
  const allTypes = ["all", ...Array.from(new Set(crimeData.map(crime => crime.type)))];
  const allStatuses = ["all", ...Array.from(new Set(crimeData.map(crime => crime.status)))];

  const chartDataByType = aggregateDataByType(crimeData);
  const chartDataByLocation = aggregateDataByLocation(crimeData).slice(0, 5); // Top 5 locations
  const chartDataByStatus = aggregateDataByStatus(crimeData);

  const handleSearch = () => {
    let filtered = crimeData;

    if (searchQuery) {
      filtered = filtered.filter(report =>
        report.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(report => report.type === typeFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(report =>
        report.date >= dateRange.start && report.date <= dateRange.end
      );
    }

    setFilteredReports(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved": return "bg-green-900 text-green-300";
      case "Pending": return "bg-yellow-900 text-yellow-300";
      case "Under Investigation": return "bg-blue-900 text-blue-300";
      default: return "bg-gray-700 text-gray-300";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Theft": return "💰";
      case "Assault": return "👊";
      case "Vandalism": return "🔨";
      case "Robbery": return "🔪";
      case "Cybercrime": return "💻";
      default: return "📝";
    }
  };

  const exportData = () => {
    const csvContent = [
      ["ID", "Type", "Location", "Date", "Time", "Status", "Details"].join(","),
      ...filteredReports.map(report => [
        report.id,
        report.type,
        report.location,
        report.date,
        report.time,
        report.status,
        `"${report.details}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'crime_reports.csv');
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-400">Crime Reports Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-blue-900 text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Bangladesh Police</span>
              <span className="text-sm text-gray-400">March 16, 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`py-4 px-6 flex items-center space-x-2 ${activeTab === "reports" ? "border-b-2 border-blue-500 text-blue-400" : "text-gray-400 hover:text-gray-300"}`}
            onClick={() => setActiveTab("reports")}
          >
            <List size={18} />
            <span>Reports</span>
          </button>
          <button
            className={`py-4 px-6 flex items-center space-x-2 ${activeTab === "analytics" ? "border-b-2 border-blue-500 text-blue-400" : "text-gray-400 hover:text-gray-300"}`}
            onClick={() => setActiveTab("analytics")}
          >
            <BarChart2 size={18} />
            <span>Analytics</span>
          </button>
        </div>

        {activeTab === "reports" && (
          <>
            {/* Filters */}
            <div className="bg-gray-800 rounded-lg shadow p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <select
                    className="block w-full rounded-md border-gray-600 bg-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    {allTypes.map(type => (
                      <option key={type} value={type}>{type === "all" ? "All Types" : type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    className="block w-full rounded-md border-gray-600 bg-gray-700 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    {allStatuses.map(status => (
                      <option key={status} value={status}>{status === "all" ? "All Statuses" : status}</option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={handleSearch}
                  >
                    <Filter size={16} className="mr-2" />
                    Filter
                  </button>
                  <button
                    className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={exportData}
                  >
                    <Download size={16} className="mr-2" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Reports Table */}
            <div className="bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Location</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date & Time</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report) => (
                        <tr key={report.id} className="hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-xl mr-2">{getTypeIcon(report.type)}</span>
                              <span className="font-medium text-gray-200">{report.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Map size={16} className="text-gray-400 mr-2" />
                              <span className="text-gray-300">{report.location}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar size={16} className="text-gray-400 mr-2" />
                              <span className="text-gray-300">{report.date}, {report.time}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                              {report.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-300">{report.details}</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                          <div className="flex flex-col items-center justify-center py-6">
                            <AlertCircle size={24} className="text-gray-500 mb-2" />
                            <p>No reports found matching your criteria</p>
                            <button
                              className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
                              onClick={() => {
                                setSearchQuery("");
                                setTypeFilter("all");
                                setStatusFilter("all");
                                setDateRange({ start: "", end: "" });
                                setFilteredReports(crimeData);
                              }}
                            >
                              Reset filters
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {filteredReports.length > 0 && (
                <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400">
                    Showing {filteredReports.length} of {crimeData.length} reports
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Crime Types Chart */}
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-200 mb-4">Crime by Type</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartDataByType}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                      itemStyle={{ color: '#F9FAFB' }}
                      labelStyle={{ color: '#F9FAFB' }}
                    />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Locations Chart */}
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-200 mb-4">Top 5 Crime Locations</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartDataByLocation}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9CA3AF" />
                    <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={80} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                      itemStyle={{ color: '#F9FAFB' }}
                      labelStyle={{ color: '#F9FAFB' }}
                    />
                    <Bar dataKey="value" fill="#60A5FA" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Status Chart */}
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-200 mb-4">Cases by Status</h2>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartDataByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartDataByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                      itemStyle={{ color: '#F9FAFB' }}
                      labelStyle={{ color: '#F9FAFB' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-200 mb-4">Crime Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Total Reports</p>
                      <p className="text-2xl font-bold text-gray-200">{crimeData.length}</p>
                    </div>
                    <div className="bg-blue-900 rounded-full p-3">
                      <AlertCircle size={20} className="text-blue-300" />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Resolved Cases</p>
                      <p className="text-2xl font-bold text-green-400">
                        {crimeData.filter(crime => crime.status === "Resolved").length}
                      </p>
                    </div>
                    <div className="bg-green-900 rounded-full p-3">
                      <TrendingUp size={20} className="text-green-300" />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Most Common Type</p>
                      <p className="text-2xl font-bold text-gray-200">
                        {chartDataByType.sort((a, b) => b.value - a.value)[0]?.name || "None"}
                      </p>
                    </div>
                    <div className="bg-purple-900 rounded-full p-3">
                      <Filter size={20} className="text-purple-300" />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Resolution Rate</p>
                      <p className="text-2xl font-bold text-yellow-400">
                        {`${((crimeData.filter(crime => crime.status === "Resolved").length / crimeData.length) * 100).toFixed(1)}%`}
                      </p>
                    </div>
                    <div className="bg-yellow-900 rounded-full p-3">
                      <BarChart2 size={20} className="text-yellow-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;