/**
 * Local image helper — the app ships its own copies of every photo (in
 * public/images/, downloaded once from Unsplash) so it works fully offline
 * and on GitHub Pages without depending on a third-party CDN at runtime.
 *
 * Vite serves public/ at BASE_URL, so we build the path here rather than
 * hardcoding "/", which would break under the GitHub Pages "/<repo>/" base.
 */
export const img = (file) => `${import.meta.env.BASE_URL}images/${file}`

export default img
