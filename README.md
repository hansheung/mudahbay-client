
# Mudahbay Client

Mudahbay Client is the frontend application for the Mudahbay online marketplace platform. This React-based client provides a user-friendly interface for buyers and sellers to interact with the marketplace, manage product listings, and handle transactions.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
  - [Building for Production](#building-for-production)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

This repository contains the frontend code for Mudahbay, an online marketplace platform. The client is built using React and Tailwind CSS, offering a seamless user experience for managing accounts, browsing products, and handling transactions. The client communicates with the Mudahbay Server via RESTful APIs.

## Features

- **User Authentication**: Sign up, log in, and manage user accounts.
- **Product Browsing**: View product listings with search and filter capabilities.
- **Review System**: Submit and view product and seller reviews.
- **Responsive Design**: Fully responsive design built with Tailwind CSS.
- **Interactive UI**: Modern, interactive UI components built with React.

## Technologies

- **React**: JavaScript library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Axios**: Promise-based HTTP client for making API requests.
- **React Router**: Library for routing and navigation in React applications.
- **Context API**: For managing global state in the application.

## Getting Started

To get the client running locally, follow these steps:

### Prerequisites

- **Node.js** (v14.x or later)
- **npm** (v6.x or later)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/hansheung/mudahbay-client.git
    cd mudahbay-client
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

### Running the App

To run the development server:

```bash
npm start
```

The app will run on `http://localhost:3000` by default.

### Building for Production

To create a production build:

```bash
npm run build
```

The optimized production build will be located in the `build/` directory.

## Environment Variables

The following environment variables are required to run the client:
```
REACT_APP_API_URL=http://localhost:yourserverportnumber
```
Example `.env` file:

```plaintext
REACT_APP_API_URL=http://localhost:8888
```

## Folder Structure

The project directory structure is as follows:

```plaintext
mudahbay-client/
├── public/
├── src/
│   ├── assets/          # Images, icons, and other assets
│   ├── components/      # Reusable UI components
│   ├── contexts/        # Context API providers
│   ├── pages/           # React components for different pages
│   ├── services/        # API service functions
│   ├── styles/          # Global CSS and Tailwind configuration
│   ├── App.js           # Main app component
│   ├── index.js         # App entry point
│   └── ...
└── ...
```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Please ensure your code follows the project's coding standards and includes tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
