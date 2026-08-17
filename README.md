# Suno Vibe — GitHub Pages build

A static HTML/CSS/JavaScript radio-style music player with 9 themed channels,
built around the reference screenshots and a retro golden-hour radio layout.
It streams the MP3 links you supplied; it does **not** upload or bundle the
MP3 files themselves.

## Deploy

1. Upload `index.html`, `styles.css`, `app.js`, and `songs.js` to your GitHub
   Pages folder.
2. Keep the files in the same directory.
3. Open the GitHub Pages URL.

## Channels

Nine channels ship with real playlists, switchable from the dropdown in the
top bar: Papa Ke Jamane Ke Gaane, Bhojpuri Banger, 2009s Vibe, Bartan Time,
Gym Jam, Genz Gaane, Neendi Time, Shadi Samaroh, and The Great KK. Each has
its own hero title/subtitle and a dedicated R2 folder. Switching channels
starts a fresh shuffle of that channel's songs.

## Shuffle & playback history

Shuffle uses a proper "bag" algorithm, not pure randomness:

1. Every song index is put into a shuffled queue (a Fisher–Yates shuffle of
   the whole channel playlist).
2. Songs play front-to-back through that queue, so **every song plays
   exactly once before anything repeats**.
3. When the queue is exhausted, a brand-new shuffled queue is built
   (avoiding an immediate repeat of the last song played) and playback
   continues from there.

**Previous** walks backward through this same queue rather than doing index
arithmetic on the raw playlist — so it always returns to the actual song
that played before, not an unrelated neighbour in the underlying list.
Picking a song manually from the playlist popup slots it into the queue
right after the current position, so Previous/Next both stay correct
afterward too.

There is no shuffle on/off toggle — shuffle is always on, by design.

## Playback

The player uses the normal browser `<audio>` element. This is deliberate:
it avoids Web Audio/CORS processing that can cause cross-origin playback
problems. Browsers still require a user gesture before starting audio in
many cases, so the first song loads on page load but does not auto-play —
you press Play once. After that, Next/Previous preserve whatever playback
state you were in: paused stays paused, playing keeps playing. Switching
channels does the same.

Tap anywhere on the mini player (cover, title, artist) to open the full
playlist for the current channel; the transport buttons and seek bar are
excluded from that tap zone so they keep working normally. If a particular
MP3 fails, the player shows a **Playback unavailable** panel with Retry —
clicking Retry counts as a fresh user gesture, so it both reloads the
track and attempts to play it. Check that the R2 URL is public/reachable
and returns an audio response.

## Other controls

- Volume slider + mute button, with keyboard shortcuts: Space to
  play/pause, ←/→ to seek 5s, ↑/↓ for volume.
- Fullscreen toggle.
- Instagram DM button and a "Buy me a coffee" link in the channel dropdown
  footer — both just show a toast; wire up real links/payment info in
  `app.js` if you want them functional.

## Not implemented

The player does **not** have: favorites, recently played, in-app search, a
theme switcher, or a repeat-track toggle (there's an internal `repeat` flag
in `app.js` but no UI wired to it — it's currently always off). If you want
any of these, they'd need to be built; this README no longer claims they
exist.

## Important privacy note

The playlist ID/path in the code is only an organization/obfuscation
mechanism. Because a browser must receive the MP3 URL to play it, a visitor
can inspect the URL in browser developer tools/network logs. True access
protection requires private storage plus signed URLs or an authenticated
server/worker.

## Layout behavior

- The website is a one-screen UI with page-level scrolling disabled.
- Selecting a song from the playlist popup starts playback immediately;
  page load does not auto-play.
