# DocServant for Spreadsheets

> Turn documents into structured spreadsheets with AI-powered extraction

**Live Demo**: [https://dcsrv-sheets.lovable.app/](https://dcsrv-sheets.lovable.app/)

DocServant for Spreadsheets is a modern web application that uses AI to extract structured data from documents (PDFs, Word files, scanned images) and converts them into clean, Excel-ready spreadsheets. Perfect for processing invoices, bank statements, contracts, and other structured documents.

## ✨ Features

- 🤖 **AI-Powered Extraction** - Automatically extract structured data from documents
- 📄 **Multiple Document Types** - Support for PDFs, Word documents, and scanned images
- 📊 **Excel Export** - Export extracted data as Excel, CSV, or JSON
- 🎯 **Custom Templates** - Create and manage extraction templates
- 📈 **Usage Tracking** - Monitor your document processing usage
- 🔐 **Secure Authentication** - Built with Supabase Auth
- 🚀 **API Access** - RESTful API for programmatic access (Pro & Business plans)
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 7
- **UI Library**: shadcn/ui (Radix UI components)
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **State Management**: React Query (TanStack Query)
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner (toast notifications)

### Backend
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript
- **Auth**: Supabase Auth with JWT verification
- **Development**: tsx for hot reload

### Infrastructure
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Lovable Platform

## 📋 Prerequisites

- Node.js 18+ (recommend using [nvm](https://github.com/nvm-sh/nvm))
- npm or yarn
- Supabase account (for authentication)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd dcsrv-sheets
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Create a `server/.env` file for the backend:

```env
PORT=3001
SUPABASE_JWKS_URL=your_supabase_jwks_url
```

> **Note**: Make sure to add `.env` and `server/.env` to `.gitignore` (already included)

### 4. Start Development Servers

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Frontend will run on `http://localhost:8080`

**Terminal 2 - Backend:**
```bash
cd server
npm run dev
```
Backend will run on `http://localhost:3001`

The frontend is configured to proxy `/api/*` requests to the backend automatically.

## 📁 Project Structure

```
dcsrv-sheets/
├── server/                 # Backend Express server
│   ├── src/
│   │   ├── index.ts        # Main server entry point
│   │   └── middleware/
│   │       └── auth.ts     # Supabase JWT auth middleware
│   └── package.json
├── src/
│   ├── components/         # React components
│   │   ├── app/           # App-specific components
│   │   ├── layout/        # Layout components
│   │   ├── shared/        # Shared components
│   │   └── ui/            # shadcn/ui components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and configs
│   │   ├── supabase.ts   # Supabase client
│   │   └── utils.ts      # Helper functions
│   ├── pages/             # Page components
│   │   ├── app/          # Protected app pages
│   │   └── ...           # Public pages (Home, Login, etc.)
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── vite.config.ts        # Vite configuration
└── package.json         # Frontend dependencies
```

## 🧩 Key Features Implementation

### Authentication
- Supabase Auth integration for email/password authentication
- Protected routes with automatic redirects
- Session persistence across page reloads
- User profile management

### Document Processing
- Template-based extraction
- Batch processing support
- Multiple export formats (Excel, CSV, JSON)
- Processing history tracking

### API Integration
- RESTful API endpoints
- JWT-based authentication
- Webhook support (Pro & Business plans)

## 📜 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `cd server && npm run dev` - Start backend with hot reload

## 🔧 Configuration

### Vite Proxy
The frontend is configured to proxy API requests to the backend:

```typescript
// vite.config.ts
proxy: {
  "/api": {
    target: "http://localhost:3001",
    changeOrigin: true,
  }
}
```

### Supabase Setup
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Project Settings > API
3. For backend JWT verification, get the JWKS URL from your Supabase project

## 🚢 Deployment

The project is currently deployed on [Lovable Platform](https://lovable.dev).

To deploy:
1. Push changes to your repository
2. Lovable will automatically build and deploy
3. Configure environment variables in Lovable dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 🆘 Support

For issues and questions:
- Check the [Help Center](/help) page
- Review the [Examples](/examples) page
- Contact support through the app

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

---

Made with ❤️ for document processing automation
