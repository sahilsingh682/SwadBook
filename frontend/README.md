# Recipe Rebel — Frontend Application

This directory contains the client-side single page application (SPA) for **Recipe Rebel**, built with React 18, Vite 5, TypeScript 5, Tailwind CSS 3, and shadcn/ui.

---

## 🚀 Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI accessible primitives)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Server Cache**: [@tanstack/react-query](https://tanstack.com/query)
- **Form Handling & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Client Backend Integration**: [@supabase/supabase-js](https://supabase.com/docs/reference/javascript)
- **Toast Notifications**: [Sonner](https://sonner.emilkowal.ski/)

---

## 📁 Directory Structure

```
frontend/
├── public/                     # Static assets, logos, favicon
├── src/
│   ├── assets/                 # App images (e.g. auth-hero.jpg)
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # 49+ shadcn/ui components (buttons, dialogs, inputs)
│   │   ├── AIChatbot.tsx       # Floating AI Dietician chat assistant (Google Gemini)
│   │   ├── Layout.tsx          # Application shell, navbar, and footer
│   │   ├── NavLink.tsx         # Navigation link component with active state
│   │   ├── PasswordStrengthMeter.tsx  # Dynamic password strength evaluator
│   │   ├── ProtectedRoute.tsx  # Auth guard for protected routes
│   │   ├── RecipeCard.tsx      # Recipe preview card with ratings, veg/non-veg badge, tags
│   │   └── SharePreviewModal.tsx # Social share card preview generator
│   ├── data/
│   │   └── famousRecipes.ts    # 33+ curated Indian state dishes & macros
│   ├── hooks/                  # Custom React hooks (useToast, useMobile)
│   │   ├── use-mobile.tsx      # Mobile viewport detection
│   │   └── use-toast.ts        # Toast dispatchers
│   ├── integrations/           # Backend SDK client singletons
│   │   ├── supabase/           # Supabase client, types, preview auth
│   │   └── lovable/            # Lovable OAuth wrapper
│   ├── lib/                    # Utilities, validation schemas, AuthContext
│   │   ├── auth.tsx            # Full auth context (session, user, admin role, suspension state)
│   │   ├── utils.ts            # Tailwind class merging (cn utility)
│   │   └── validations.ts      # Zod recipe submission schema
│   ├── pages/                  # Route views
│   │   ├── Home.tsx            # Recipe feed, multi-filter control center, search
│   │   ├── Auth.tsx            # Sign in, Sign up, Google OAuth, Forgot Password
│   │   ├── ResetPassword.tsx   # Password recovery page
│   │   ├── RecipeDetail.tsx    # Full recipe view, state, macros, steps, reviews
│   │   ├── UploadRecipe.tsx    # Recipe creation with state, dietary, fitness tags
│   │   ├── EditRecipe.tsx      # Recipe editor with full taxonomy controls
│   │   ├── Dashboard.tsx       # User's uploaded recipes, favorites, profile
│   │   ├── AdminDashboard.tsx  # Admin moderation queue & user account governance
│   │   └── NotFound.tsx        # 404 page
│   ├── App.tsx                 # App entry, React Router routes, QueryClient
│   ├── main.tsx                # React DOM mounting
│   └── index.css               # Design tokens, CSS variables, typography
├── index.html
├── vite.config.ts              # Vite bundler configuration & @/ alias
├── tailwind.config.ts          # Color themes, typography, animations
└── package.json
```

---

## 🔑 Environment Variables

Configure `.env` in the `frontend/` directory (or use root `.env`):

```env
VITE_SUPABASE_PROJECT_ID="rxtzrpvaaumxwtulkmgy"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_xd8azLJGtiDPYQyKPRSKrw_JUS6BfO2"
VITE_SUPABASE_ANON_KEY="sb_publishable_xd8azLJGtiDPYQyKPRSKrw_JUS6BfO2"
VITE_SUPABASE_URL="https://rxtzrpvaaumxwtulkmgy.supabase.co"
```

---

## 🛠️ Scripts

From inside `frontend/`:
```bash
# Start local dev server (default: http://localhost:5173)
npm run dev

# Run TypeScript type check
npm run typecheck

# Production build
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```
