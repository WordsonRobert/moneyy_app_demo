# Reel videos

Drop your demo clips in this folder to make the **Reels** feed play real video.

Expected filenames (matching `src/data/reels.js`):

```
public/reels/reel-1.mp4   The pub never really closes
public/reels/reel-2.mp4   Wake up in the Lantern King
public/reels/reel-3.mp4   Dry-aged, flame-kissed
public/reels/reel-4.mp4   Rooftop hours
public/reels/reel-5.mp4   Book a table by the fire
```

Tips:
- **Vertical / 9:16** looks best (the reel fills a phone screen).
- Keep them **small** — a few seconds, ideally under ~5 MB each — so the page
  (and your git repo) stays light. GitHub blocks files over 100 MB.
- Format: **`.mp4` (H.264 + AAC)** plays everywhere.
- They loop and autoplay muted, exactly like Instagram reels.

Until a file is present, that reel automatically shows its poster image with a
slow pan — so the feed always looks complete. To add more reels or rename these,
edit `src/data/reels.js`.

> Larger than ~10 MB per clip? Consider [Git LFS](https://git-lfs.com/) so the
> repo stays fast to clone.
