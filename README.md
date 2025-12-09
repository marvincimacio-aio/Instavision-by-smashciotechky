<img width="1536" height="708" alt="instagrabber" src="https://github.com/user-attachments/assets/f6d84359-8893-4891-bea2-abaa784b6ed5" />
Instavision by smashciotechky


Instavision is a lightweight browser script and bookmarklet that helps you inspect and compare Instagram follower and following lists. It runs entirely in your browser (no backend required), uses Instagram's public GraphQL endpoints to page through lists, and provides quick diffs such as "Don't Follow Me Back" and "I Don't Follow Back". The tool is intended for personal, small-scale use — not for large-scale scraping — and stores saved sessions locally in `localStorage`.

**Features**
- **Fetch:** Fetch followers and following lists for a given username (uses Instagram's public GraphQL endpoints).
- **Compare:** Compute diffs: "Don't Follow Me Back" and "I Don't Follow Back".
- **Save Sessions:** Save fetched lists into `localStorage` for later comparison between sessions. Key: `ig_sessions_v1`.
- **Responsive UI:** Lightweight, themed popup with dark/light toggle and keyboard conveniences.
- **Cancelable:** Ongoing fetches can be cancelled.

**Files**
- `instavision.js`: Main script. Drop this into the browser console, a bookmarklet, or a snippet to run.

Usage
-----

1. Quick (developer): open the browser console on any page and paste the contents of `instavision.js`, then press Enter. The Instavision overlay will appear.

2. Bookmarklet: create a new bookmark whose URL is the `javascript:`-prefixed contents of `instavision.js`. Clicking the bookmark will inject the overlay on the current page.

3. Once open:
- Enter the Instagram username (without `@`) in the input.
- Click **Fetch Followers & Following** to fetch both lists.
- After fetching, click **Compare** to compute diffs:
  - **Don't Follow Me Back** — users you follow but who don't follow you.
  - **I Don't Follow Back** — users who follow you but you don't follow back.
- Use **Save** to save the current fetched lists into a session (stored in `localStorage`). Use the Sessions tab to load or compare saved sessions.

Implementation notes
--------------------

- The UI is built entirely in `instavision.js` and injected as an overlay element (`#igPopup`).
- Network logic:
  - `getUserMeta(username)` — resolves the user's internal numeric id (pk) and retrieves follower/following counts via Instagram search + GraphQL queries.
  - `fetchListAll(pk, type, totalEstimate, signal)` — pages through Instagram GraphQL endpoints (query_hash values embedded in the script) to collect all followers or following entries. It uses a small delay between pages and updates progress bars.
  - `safeFetch(url, retries, signal)` — wrapper around `fetch` with retry and optional abort support.
- Rendering:
  - `renderList(...)` — builds the list views with client-side filtering/search.
  - Tabs for Followers, Following, Compare results, and Sessions.
- Sessions:
  - Stored under `localStorage` key `ig_sessions_v1`.
  - Sessions contain `followers`, `followings`, timestamp, optional name, and a detected username if available.
 
    
Code Description
----------------

- **Entry point:** `instavision.js` builds and injects the overlay UI (`#igPopup`) and wires UI controls to the network and storage logic.
- **Primary helpers:**
  - `getUserMeta(username)` — looks up the numeric user id (pk) and basic counts used to drive pagination.
  - `fetchListAll(pk, type, totalEstimate, signal)` — pages through Instagram's GraphQL endpoints to collect either followers or followings. Handles cursors, uses a small delay between pages, and reports progress to the UI.
  - `safeFetch(url, retries, signal)` — fetch wrapper with retry logic and optional `AbortController` support for cancellation.
- **Rendering & UI:**
  - `renderList(...)` — creates list views with client-side filtering, search, and clickable rows. Tabs switch between Followers, Following, Compare results, and Sessions.
  - Progress bars and status messages are updated from the fetch/pagination handlers so the user sees live progress and can cancel long operations.
- **Compare logic:** The compare step builds sets from fetched `followers` and `followings` and computes two diffs: "Don't Follow Me Back" (you follow them, they don't follow you) and "I Don't Follow Back" (they follow you, you don't follow them).
- **Sessions & storage:** Saved sessions are JSON objects stored under `localStorage` key `ig_sessions_v1`. Each session includes `followers`, `followings`, a timestamp, optional name, and metadata for easy reloading and comparison.
- **Cancelation:** Long-running network work uses `AbortController` signals so the user can cancel fetches mid-flow via the Cancel button.
- **Constants & maintenance points:** Query hashes (GraphQL `query_hash` values) and small pagination delays are defined in the script as constants; these are the most likely maintenance points if Instagram changes internals.
- **Data shapes (brief):**
  - `followers` / `followings`: arrays of objects with at least `{id, username, full_name, profile_pic_url}`.
  - `session`: `{name?, username?, timestamp, followers:[], followings:[]}`.


Limitations & Notes
-------------------

- Instagram's internal GraphQL endpoints and `query_hash` identifiers are not part of a stable public API. If Instagram changes query hashes, response formats, or adds new protections, the script may stop working until updated.
- CORS / Auth: some requests may require an authenticated browser session or may be subject to CORS/restrictions depending on where the script is run. Running the script while logged into Instagram in the same browser increases success.
- Rate limits: fetching large lists may be slow or rate-limited by Instagram. Use the Cancel button if a fetch is taking too long.
- The script is a convenience tool for personal use; avoid abusive or large-scale scraping.

Privacy
-------

- The script runs in your browser and stores saved sessions locally in `localStorage` only. It does not ship saved sessions anywhere by default.

Troubleshooting
---------------

- If fetches fail with network or permission errors, try running the snippet from a page on `instagram.com` while logged in.
- To clear saved sessions manually, run:

```
localStorage.removeItem('ig_sessions_v1')
```

Extending / Contributing
------------------------

- To update query hashes or tweak pagination delays, edit `instavision.js` (see constants passed into the GraphQL endpoints).
- Pull requests or issues (ideas for improvements): contact the author or maintain the script locally.

Author
------

Instavision — by smashciotechky
