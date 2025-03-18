# Getting Started

Follow these steps to set up and run the project locally.

## 1. Create an Environment File

Create a `.env.local` file in the root directory of your project.

## 2. Set the Backend Base URL

Inside the `.env.local` file, add the following variable and set it to your backend base URL:

```env
NEXT_PUBLIC_BACKEND_BASE_URL=http://laravel-api.test
```

## 3. Install Dependencies

Run the following command to install the necessary Node modules:

```bash
npm install
```

## 4. Start the Development Server

Run one of the following commands to start the development server:

# Developement
```bash
npm run dev
```

# Production
```bash
npm run build
npm run start
```

## 5. Open in Browser

Once the server is running, open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

