# UMSKAL floor discovery update

This update changes UMSKAL's Discover interaction. The other locations retain their existing discovery panels. Existing narration, Story videos, tabletop placement and passport behavior remain available.

## Try it

1. Open the website and start the AR camera.
2. Scan the UMSKAL marker. The floor directory appears automatically on the left, with **13 at the top and 1 at the bottom**. No extra Discover tap is required.
3. Tap a floor. Its band is highlighted and a pop-up opens beside the directory.
4. Swipe the image left/right, use the arrow buttons, or tap an image indicator. On a keyboard, focus the image and use Left/Right arrows.
5. Read the floor information below the gallery. Scroll within the pop-up if needed.
6. Tap another floor directly in the left directory to switch. Close with × or Escape.

The gallery is manually swipeable; it does not advance automatically while a visitor reads. Moving past the last image returns to the first. Each floor remembers its discovery in the existing passport system.

All 13 buttons fit on the tested 390 × 844 portrait viewport. On shorter screens and in landscape the directory scrolls, keeping usable button sizes. Losing the UMSKAL marker hides the directory and pop-up; reacquiring it restores the directory. Switching locations or returning Home closes it.

The same directory/gallery is available in **Explore in 3D first**. Selecting a floor there focuses the tower. Close the gallery and use **Reset view** to return to the whole campus. Story and the other interactions keep their existing behavior.

## Replace the sample images

No real floor photographs were included in the supplied project. The three gallery illustrations are **clearly labelled placeholders**, reused across the 13 floors. They are not photographs of UMSKAL. The floor descriptions remain your previous labelled sample content.

1. Put your photographs in `assets/floors/`.
2. Open `coding/umskal-floor-gallery.js`.
3. Add an override for each floor, after the default gallery definition:

```js
FLOOR_GALLERIES['floor-01'] = [
  {
    src: './assets/floors/floor-01-entrance.jpg',
    caption: { en: 'Entrance', ms: 'Pintu masuk' }
  },
  {
    src: './assets/floors/floor-01-reception.jpg',
    caption: { en: 'Reception', ms: 'Kaunter sambutan' }
  }
];
```

Use `floor-02` through `floor-13` for the remaining floors. You can give each floor any number of images. Leave off `sample: true` when you add real photographs. An empty array displays “Floor photos coming soon”; a single image disables the previous/next buttons. Missing files display “Image unavailable” while the floor information remains accessible.

The path starts from `index.html`, and filenames are case sensitive on many web hosts. Use reasonably compressed photos for mobile loading. The viewer shows the full image without stretching it.

Edit floor titles and descriptions in the UMSKAL `points` section of `coding/content.js`. The numbered floor bands remain approximate.

## Run this copy

Extract `Labuan-Ar-Floor-Gallery.zip`, copy its `Labuan-Ar-Floor-Gallery` folder into XAMPP's `htdocs`, and open `http://localhost/Labuan-Ar-Floor-Gallery/` on that computer. For the phone camera, use the published HTTPS address. Keep `assets`, `coding` and `libs` beside `index.html`.

The original uploaded ZIP and previous Tabletop edition are unchanged. See UPDATE-GUIDE.md for the existing audio, story-video and marker configuration. Test the final published version on your presentation phone with its real printed marker.
