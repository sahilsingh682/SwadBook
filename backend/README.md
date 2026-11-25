# Recipe Rebel — Backend & Database (Supabase)

This directory contains the database schema, SQL migrations, seed data, storage policies, and serverless Edge Functions for **Recipe Rebel**.

---

## 🏗️ Architecture Overview

The backend is built on **Supabase** (PostgreSQL 15 + PostgREST + GoTrue Auth + Storage + Deno Edge Functions).

- **Project Ref ID**: `rxtzrpvaaumxwtulkmgy`
- **Project URL**: `https://rxtzrpvaaumxwtulkmgy.supabase.co`
- **Region**: AWS (Default Supabase Region)

---

## 📁 Directory Structure

```
backend/
└── supabase/
    ├── config.toml                     # Supabase CLI project configuration
    ├── consolidated_migration.sql      # Complete single-run SQL migration script
    ├── seed_recipes.sql                # Seed data script with System Master Chef & dishes
    ├── functions/
    │   └── ai-dietician/               # Deno Edge Function with Gemini & Lovable AI support
    │       └── index.ts
    └── migrations/                     # Chronological SQL migrations (1 through 8)
        ├── 20251202093109_*.sql        # Initial schema, tables, RLS, triggers & storage
        ├── 20251202093122_*.sql        # Fix search_path on update_updated_at_column
        ├── 20251204052812_*.sql        # Harden user_roles SELECT policy
        ├── 20251204060725_*.sql        # Add meal_type, calories, protein, carbs, fat
        ├── 20251205050046_*.sql        # Add steps text[] column
        ├── 20251210060643_*.sql        # Public ratings view & storage bucket limits
        ├── 20251210060713_*.sql        # Recreate public_ratings as SECURITY INVOKER
        └── 20261125010000_*.sql        # Famous foods, dietary_type, tags, state, snacks
```

---

## 🗄️ Database Schema & Entities

### 1. Enums & Domain Types
- `public.app_role`: `'admin'`, `'user'`
- `public.recipe_status`: `'pending'`, `'approved'`, `'rejected'`

### 2. Tables
| Table | Description | Primary Key | Key Columns / Constraints |
| :--- | :--- | :--- | :--- |
| `public.profiles` | User profile data & status | `id UUID` (FK -> `auth.users.id`) | `name`, `is_suspended BOOLEAN`, `suspension_reason TEXT`, `created_at`, `updated_at` |
| `public.user_roles` | RBAC roles mapping | `id UUID` | `user_id` (FK -> `profiles.id`), `role` (`app_role`) |
| `public.recipes` | Recipe catalog | `id UUID` | `author_id` (FK -> `profiles.id`), `title`, `description`, `ingredients TEXT[]`, `steps TEXT[]`, `preparation_time`, `meal_type` (`breakfast`, `lunch`, `dinner`, `snacks`), `dietary_type` (`vegetarian`, `non-vegetarian`), `state TEXT`, `tags TEXT[]`, `calories`, `protein`, `carbs`, `fat`, `image_url`, `status`, `average_rating` |
| `public.comments` | Recipe comments | `id UUID` | `recipe_id` (FK -> `recipes.id`), `user_id` (FK -> `profiles.id`), `text` |
| `public.ratings` | User ratings (1-5 stars) | `id UUID` | `recipe_id` (FK -> `recipes.id`), `user_id` (FK -> `profiles.id`), `rating` (1-5) |
| `public.favorites` | User saved recipes | `id UUID` | `recipe_id` (FK -> `recipes.id`), `user_id` (FK -> `profiles.id`) |

### 3. Views
- `public.public_ratings`: Security Invoker view exposing rating statistics while hiding sensitive `user_id` from unauthenticated or public viewers.

### 4. Automated Triggers & Functions
- `handle_new_user()`: Triggered on `auth.users` insert -> creates `profiles` record and assigns default `user` role in `user_roles`.
- `update_recipe_rating()`: Triggered on `ratings` insert/update/delete -> recalculates `average_rating` on the parent `recipes` row.
- `update_updated_at_column()`: Triggered before update on `profiles` and `recipes` -> sets `updated_at = now()`.
- `has_role(_user_id, _role)`: Security definer SQL function checking role membership.

---

## 🔒 Row Level Security (RLS) Policies

All tables have RLS enabled:
- **`profiles`**: Publicly readable. Users can update their own profile (`auth.uid() = id`).
- **`user_roles`**: Users can view their own role (`auth.uid() = user_id`). Only admins can modify roles (`has_role(auth.uid(), 'admin')`).
- **`recipes`**: Approved recipes (`status = 'approved'`) are public. Authors can view, update, and delete their own recipes. Admins have global select, update, and delete access.
- **`comments`**: Visible on approved recipes. Authenticated users can create, update, and delete their own comments. Admins can delete any comment.
- **`ratings`**: Viewable by everyone. Authenticated users can insert, update, or delete their own ratings.
- **`favorites`**: Users can select, insert, and delete their own favorites.

---

## 📦 Supabase Storage (`recipe-images`)

- **Bucket ID**: `recipe-images`
- **Visibility**: Public (`public = true`)
- **File Size Limit**: `5242880` bytes (5 MB)
- **Allowed MIME Types**: `['image/jpeg', 'image/png', 'image/webp', 'image/gif']`
- **Upload Path Convention**: `<user_id>/<timestamp>.<ext>`
- **Storage Policies**:
  - `SELECT`: Public access to all files in `recipe-images`.
  - `INSERT`: Authenticated users only.
  - `UPDATE` & `DELETE`: Owner only, validated via `auth.uid()::text = (storage.foldername(name))[1]`.

---

## ⚡ Edge Functions (`ai-dietician`)

The `ai-dietician` function provides diet advice, recipe recommendations, and meal planning assistance.

- **Path**: `backend/supabase/functions/ai-dietician/index.ts`
- **Dual Engine Architecture**:
  1. **Google Gemini API**: Direct connection to `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent` using `GEMINI_API_KEY`.
  2. **Lovable AI Gateway**: Fallback connection to `https://ai.gateway.lovable.dev/v1/chat/completions` using `LOVABLE_API_KEY`.
  3. **High-Availability Engine**: If neither API key is configured yet, the function returns an intelligent nutritional advice calculation, preventing client 500 errors.
- **Environment Secrets**:
  - `GEMINI_API_KEY`: Google Gemini API Key (Recommended)
  - `LOVABLE_API_KEY`: Lovable AI Gateway Key (Optional)

### Setting Secrets & Deploying
```bash
# Set Gemini Secret
npx supabase secrets set GEMINI_API_KEY="<your-gemini-key>" --project-ref rxtzrpvaaumxwtulkmgy

# Deploy function
npx supabase functions deploy ai-dietician --project-ref rxtzrpvaaumxwtulkmgy --no-verify-jwt
```
