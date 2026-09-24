# Product Admin Dashboard

A beginner-friendly Next.js App Router dashboard using React, Tailwind CSS, Axios and DummyJSON. The app includes login, client-side route protection, URL-backed product search/filter/sort/pagination, product detail and add/edit/delete forms.

## Setup steps

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` (the default API URL is already configured).
4. Run `npm run dev`.
5. Open http://localhost:3000 and sign in with `emilys` / `emilyspass`.

All network requests go through `src/lib/http.ts`. Product and authentication endpoints live in `src/lib/api/`. Login credentials are provided by the assignment; this is a demo, not a production authentication design.

## Finished work

- [x] Login page using the provided DummyJSON credentials, with an error message for failed login.
- [x] Shared Axios client that attaches the saved token and handles API errors centrally.
- [x] Protected product routes, logout, product list and responsive desktop table/mobile cards.
- [x] URL-backed page, page size, search, category and sort controls; debounced search and stale-result protection.
- [x] Product details and reviews, including a not-found state for invalid product IDs.
- [x] Add and edit forms with validation, delete confirmation, loading/empty/error states and retry.
- [x] Setup documentation, DummyJSON limitations and suggested Git checkpoints.

## Project structure and build sequence

1. `src/types/product.ts`: shared shapes for products and API pages.
2. `src/lib/auth.ts` and `src/lib/http.ts`: save the token and attach it with a shared Axios request interceptor; normalize errors and redirect on 401.
3. `src/lib/api/`: endpoint functions keep HTTP details outside components.
4. `src/app/layout.tsx`, `globals.css`, and `components/`: common shell, responsive styling and small reusable pieces.
5. `/login`: submits the provided credentials and prevents duplicate submits.
6. `/products`: URL parameters hold `page`, `size`, `q`, `category` and `sort`; API results load with a debounce and stale requests are ignored. Pagination and sorting are implemented by this project.
7. `/products/[id]`: product details and reviews; invalid IDs and missing products show a not-found message.
8. `/products/new` and `/products/[id]/edit`: validated forms; delete asks for confirmation.

## Important DummyJSON behavior

- The product search endpoint and category endpoint are separate. When search and category are both selected, the client filters the search result set by category before pagination. This is suitable for this demo dataset, but large datasets should use an API that supports combined server-side filters.
- Add, update and delete endpoints return simulated results. DummyJSON does not persist those mutations, so a reload restores the original data.
- Product sorting is done on the currently fetched page. Server-wide sorting would require API sort support or fetching the full result set.
- The login token is stored in local storage for this assignment. A production app should use secure server-managed sessions and HttpOnly cookies.

## Suggested Git checkpoints

Make a small commit after each working milestone:

1. `chore: scaffold Next.js dashboard`
2. `feat: add shared Axios client and login`
3. `feat: build product list and URL controls`
4. `feat: add product details and reviews`
5. `feat: add product create edit and delete flows`
6. `docs: document setup and API limitations`

## Short project note

- **Choices:** I used the Next.js App Router, kept API functions in `src/lib/api/`, and used URL query parameters as the source of truth for product-list controls. The shared Axios instance keeps token attachment and error handling in one place.
- **Problem and fix:** DummyJSON does not support category and text search together. The app requests matching search results and applies the category filter in the browser before showing the requested page.
- **Where AI helped:** AI helped organize the assignment into small components and routes, draft the initial implementation and README, and explain the API limitation and its workaround. Review the generated code and run it locally before submitting.
