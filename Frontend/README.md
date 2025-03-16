# Bangladesh Surokkha Netra - Crime Mapping Application (Frontend)

## Overview

This is the frontend component of the Bangladesh Surokkha Netra project, a web application designed to visualize and analyze crime data across Bangladesh. It utilizes React, React Leaflet, and React Leaflet Heatmap Layer to provide interactive maps, filtering options, and statistical insights.

## Features

-   **Interactive Map:** Displays crime incidents using markers or a heatmap, powered by React Leaflet.
-   **Data Filtering:** Allows users to filter crime data by type, severity, and date range.
-   **Crime Statistics:** Provides detailed statistics on crime incidents, including total crimes, crimes by type, and crimes by severity.
-   **Heatmap Visualization:** Offers a heatmap view to visualize crime density.
-   **Marker Visualization:** Offers a marker view to visualize individual crime locations.
-   **Crime Details:** Displays detailed information about selected crime incidents in a popup.
-   **Responsive Design:** Ensures the application is accessible and usable on various devices.
-   **Data Export (Planned):** A feature to export the statistics data.
-   **Satellite map view:** The map defaults to the satellite view.

## Technologies Used

-   **React:** JavaScript library for building user interfaces.
-   **React Leaflet:** React components for Leaflet maps.
-   **React Leaflet Heatmap Layer:** React component for creating heatmap layers in Leaflet.
-   **Leaflet:** Open-source JavaScript library for mobile-friendly interactive maps.
-   **Lucide React:** Icons for the user interface.
-   **Tailwind CSS:** For styling the application.
-   **Date-fns:** for date manipulation.

## Setup Instructions

1.  **Clone the Repository:**

    ```bash
    git clone <repository_url>
    cd <project_directory>
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Variables:**
    * This current front end does not need any API key for map rendering, as it uses leaflet and open street map.
    * If the backend is connected to this front end, then the backend API URL needs to be configured.

4.  **Run the Application:**

    ```bash
    npm run dev
    ```

    The application will be accessible at `http://localhost:5173`.

## Project Structure
```
src/
├── components/
│   ├── CrimeMaps.jsx       # Main component for the crime mapping application.
│   └── ...                 # Other components.
├── assets/                 # Static assets (images, icons, etc.).
├── App.jsx                 # Main App component.
├── main.jsx                # Entry point of the application.
├── index.html              # HTML template.
├── ...
```

## Data Source

-   The application currently uses demo crime data generated within the frontend.
-   In a production environment, this data would be fetched from a backend API.

## Future Enhancements

-   **Backend Integration:** Connect the frontend to a backend API for real-time data updates.
-   **User Authentication:** Implement user authentication for access control and personalized features.
-   **Advanced Filtering:** Add more advanced filtering options, such as filtering by specific locations or time periods.
-   **Data Export:** Implement functionality to export crime statistics as CSV or other formats.
-   **Real-time Updates:** Integrate real-time data updates using WebSockets or similar technologies.
-   **Improved UI/UX:** Refine the user interface and user experience based on user feedback.
-   **Location Search:** Add a search bar to find specific locations on the map.
-   **Customizable Heatmap:** Allow users to customize the heatmap's appearance and settings.
-   **Mobile Responsiveness:** Further optimize the application for mobile devices.

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them.
4.  Push your changes to your fork.
5.  Submit a pull request.

## License

This project is licensed under the MIT License.
