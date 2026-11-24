# Niki's Arcade 🕹

A personal learning log about game development & game design, built with
[Jekyll](https://jekyllrb.com/) and hosted free on **GitHub Pages**.

- **Home page:** a close-up of a light-grey arcade machine with stickers on it. Insert a coin, pick a stage with the joystick, arrow keys or buttons, and the view dives into the screen.
- **Inside pages:** a hand-drawn retro desktop with windows, desktop icons, a taskbar with a start menu, and a "Messenger" window. Closing a window (×) zooms back out to the arcade.

GitHub builds the site every time you push. You don't need to install anything.

---

## 1. Put it on GitHub (one time, ~5 minutes)

1. Create a **new repository** named exactly **`<your-username>.github.io`**. Make it **Public**, and leave "Add README" **off**.
2. On the empty repo page, click **"uploading an existing file"** and drag in **everything inside this folder** (its contents, including the `_posts`, `_layouts`, `_includes`, `_data`, `assets` folders and the page folders). Click **Commit changes**.
   > Hidden files like `.gitignore` may not upload by drag-and-drop. That's fine.
3. Go to **Settings → Pages** → *Build and deployment* → **Source: Deploy from a branch**, **Branch: `main`**, folder **`/ (root)`** → **Save**.
4. Wait 1–2 minutes and open `https://<your-username>.github.io`. 🎉 The **Actions** tab shows build progress and errors.

**Then edit `_config.yml`:** set `url` to your real address and fill in `author`, your status (`mood`, `currently_studying`, `now_playing`) and `social` links.

> **Using a different repo name** (e.g. `arcade`)? The site lives at `https://<your-username>.github.io/arcade`, and you must set `baseurl: "/arcade"`.

---

## 2. The stages (sections)

| Stage | Page | Where the content comes from |
|---|---|---|
| C++ Notes | `/cpp/` | notes in `_posts/` with `section: cpp` |
| Game Design | `/design/` | notes with `section: design` |
| Projects | `/projects/` | `_data/projects.yml` |
| Album | `/album/` | `_data/album.yml` + pictures in `assets/album/` |
| Game Reviews | `/reviews/` | notes with `section: reviews` (use the review template) |
| Devlog | `/devlog/` | notes with `section: devlog` |
| About Me | `/about/` | `about/index.html` + your status in `_config.yml` |
| Links & Guestbook | `/links/` | `_data/links.yml`, `_data/buttons.yml`, `guestbook_url` |

Names, colors, order and icons of the stages are in `_data/sections.yml`.

---

## 3. Write a note

1. Copy `_templates/note-template.md` (or `review-template.md` for a game review) into `_posts/`.
2. Rename it to `YYYY-MM-DD-short-title.md`, e.g. `2026-11-20-smart-pointers.md`. **The date in the filename is required.**
3. Set `section:` (`cpp`, `design`, `devlog` or `reviews`), fill in the rest, write in Markdown, and commit.

You can do this right on github.com: open `_posts/` → **Add file → Create new file**.

| Field | What it does |
|---|---|
| `title`, `section` | required |
| `status` | `seedling`, `budding` or `evergreen`, how finished the note is |
| `summary` | one-line subtitle, shown in lists |
| `tags` | `[chrono, game-loop]`, searchable |
| `takeaways` | shown as a yellow sticky note at the top |
| `sources` | list of `title` / `url` / `note` at the bottom |
| `updated` | date you last revised it |
| reviews only: `game`, `platform`, `year`, `rating` (1–5 hearts), `verdict`, `image` | the review box and the card on the Reviews page |

Images inside notes: put them in `assets/img/` and write `![description]({{ '/assets/img/file.png' | relative_url }})`.

---

## 4. Projects & album

- **Projects:** add a block to `_data/projects.yml` (title, description, status, `progress` 0–100 for the pixel XP bar, tools, links, optional screenshot).
- **Album:** put photos in `assets/album/` and add them to `_data/album.yml` (image, caption, date, optional `tilt`). Until then, the album shows placeholder polaroids. Click a photo to open it big.

---

## 5. Secrets & fun stuff in the arcade

- **Insert coin:** click a coin slot, the screen, `1P START`, or press Enter.
- **Move:** drag the joystick, click ▲/▼, use the arrow keys, or just click a stage.
- **Buttons:** **A** select · **B** back · **C** changes the screen color (green, amber, pink, cyan).
- **Easter eggs:**
  - Pet the cat on top of the cabinet (5 times…).
  - The gold lucky-cat sticker gives free credits.
  - Click the NIKI logo (the CRT loses signal) or the speaker grills (a tune plays).
  - Hover over the stickers to peel them, or click them.
  - **Konami code** (↑ ↑ ↓ ↓ ← → ← → B A, keyboard or joystick + buttons) unlocks a secret stage. Edit it in `secret/index.html`.
- **Sound:** all sounds are made in code (no audio files). The round SOUND button with the green light mutes them, and the choice is remembered.
- **Messenger:** sections with content show as *Online*, empty ones as *Offline*. "Niki Today" shows `_data/updates.yml`.

---

## 6. Customize

- **Arcade machine (plastic colors, sticker positions, sizes):** `assets/css/arcade.css`. Phones get their own portrait layout (the `.portrait` rules). **Desktop colors:** the variables at the top of `assets/css/desktop.css`.
- **Pixel icons & stickers:** generated into `_includes/icons.svg`.
- **Profile picture:** set `avatar` in `_config.yml` (otherwise the pixel cat is used).
- **Guestbook:** get a free one (e.g. atabook.org) and set `guestbook_url`.
- **Your 88×31 button:** `assets/img/buttons/niki-devlog.svg`. Others can copy the link-back code from the Links page.

---

## Optional: preview on your own computer

Requires Ruby. In this folder: `bundle install` then `bundle exec jekyll serve`, and open <http://localhost:4000>.
