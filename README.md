<img width="1536" height="708" alt="instagrabber" src="https://github.com/user-attachments/assets/f6d84359-8893-4891-bea2-abaa784b6ed5" />
Instavision by smashciotechky

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
