# Social Support Portal — Angular Application

A government social support portal built with Angular 17 featuring a 3-step application wizard, bilingual (English/Arabic RTL) support, and OpenAI GPT-3.5 AI writing assistance.

---

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Angular CLI 17+

```bash
npm install -g @angular/cli
```

### 1. Clone / place the project
Place this folder at `Desktop/projects/social-support-app`.

### 2. Install dependencies
```bash
cd Desktop/projects/social-support-app
npm install
```

### 3. Set up your OpenAI API Key
Open `src/environments/environment.ts` and replace:
```ts
openAiApiKey: 'YOUR_OPENAI_API_KEY_HERE'
```
with your actual key from https://platform.openai.com/api-keys

> ⚠️ Never commit your API key to version control. For production, use environment variables or a backend proxy.

### 4. Run the application
```bash
ng serve
```
Open your browser at **http://localhost:4200**

---

## Features

| Feature | Details |
|---|---|
| Multi-step wizard | 3 steps with progress bar and validation |
| Responsive design | Mobile, tablet, desktop |
| Bilingual | English + Arabic (RTL) toggle |
| Accessibility | ARIA roles, keyboard navigation, `aria-invalid`, `role="alert"` |
| Local persistence | Progress saved in `localStorage` automatically |
| AI writing help | "Help Me Write" on all 3 textarea fields in Step 3 |
| AI modal | Accept / Edit / Discard suggestion + error handling + retry |
| Mock submit | Simulated API call with reference number |

---

## Architecture

```
src/
├── app/
│   ├── components/
│   │   ├── header/              # Site header + language toggle
│   │   ├── progress-bar/        # Step indicator + progress track
│   │   ├── step1-personal/      # Personal information form
│   │   ├── step2-family/        # Family & financial info form
│   │   ├── step3-situation/     # Situation descriptions + AI
│   │   └── ai-suggestion-modal/ # AI suggestion popup
│   ├── services/
│   │   ├── translation.service.ts  # i18n (loads en/ar JSON)
│   │   ├── form-state.service.ts   # Global form state + localStorage
│   │   └── openai.service.ts       # OpenAI GPT-3.5 integration
│   ├── models/
│   │   └── application.model.ts   # TypeScript interfaces
│   ├── app.component.*            # Root shell
│   └── app.config.ts              # Angular providers
├── assets/
│   └── i18n/
│       ├── en.json                # English translations
│       └── ar.json                # Arabic translations
├── environments/
│   ├── environment.ts             # Dev config (API key here)
│   └── environment.prod.ts        # Production config
└── styles.css                     # Global design tokens + utilities
```

### Key Design Decisions
- **Standalone components** (Angular 17): No NgModule needed, simpler and tree-shakeable.
- **Signals** for reactive state (`signal()`, `computed()`) — Angular's modern reactivity.
- **Translation service** fetches JSON at runtime rather than compile-time bundles; language switch is instant with `signal<Language>`.
- **FormStateService** persists all data to `localStorage` on every change, allowing refresh recovery.
- **OpenAI prompt** is built from Step 2 data (employment status, income, housing, dependents) for contextual suggestions.
- **AI timeout** is 30 seconds; AbortController ensures the fetch is cancelled cleanly.
- **Modal is fully keyboard accessible**: Escape key closes it; focus is managed via `tabindex`.

### Possible Improvements
- Backend proxy for API key (never expose in client-side code for production)
- Add `@angular/localize` for compiled translations and proper i18n pluralization
- File upload for supporting documents
- Backend persistence (replace mock submit)
- Unit tests with Jest + Angular Testing Library
- E2E tests with Cypress or Playwright

---

## Tech Stack

| | |
|---|---|
| Framework | Angular 17 (Standalone) |
| Forms | Reactive Forms (`FormBuilder`, `Validators`) |
| State | Angular Signals + Service |
| i18n | Custom JSON translation service |
| AI | OpenAI GPT-3.5 Turbo via `fetch` |
| Styling | Custom CSS with CSS Variables (no UI library needed) |
| Persistence | `localStorage` |
