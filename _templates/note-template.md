---
# Copy this file into _posts/ and rename it:  YYYY-MM-DD-short-title.md
#   e.g.  _posts/2026-11-20-smart-pointers.md
title: "Your note title"
section: cpp           # cpp | design | devlog  (ids from _data/sections.yml)
status: seedling       # seedling | budding | evergreen
summary: "One sentence that says what this note is about."
tags: [tag-one, tag-two]

# Optional: shown as a highlighted box at the top
takeaways:
  - "The main thing I learned."
  - "A second thing worth remembering."

# Optional: shown at the bottom
sources:
  - title: "Name of the talk / article / book"
    url: "https://example.com"
    note: "Author, year"

# Optional: set when you revisit a note
# updated: 2026-12-01
---

Write your note here in Markdown.

## A heading

Some text, **bold**, _italic_, a [link](https://example.com).

```cpp
// code blocks get syntax highlighting
int main() { return 0; }
```

Images: put them in assets/img/ and use
![Description of the image]({{ '/assets/img/my-screenshot.png' | relative_url }})
