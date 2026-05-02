# Self-hosted fonts

Drop the **NDot 55** font files here to enable Nothing's signature dot-matrix
rendering in the Nothing theme. Without them, the browser falls back to **Doto**
(Google Fonts) which is the closest free analogue.

## Required files

```
ndot-55.woff2          # weight 400 (preferred — smallest)
ndot-55.otf            # weight 400 (fallback)
ndot-55.ttf            # weight 400 (fallback)
ndot-55-bold.woff2     # weight 700 (preferred)
ndot-55-bold.otf       # weight 700 (fallback)
ndot-55-bold.ttf       # weight 700 (fallback)
```

You only need one format per weight; `.woff2` is the smallest and best supported.

## Where to get NDot

NDot is a proprietary Nothing typeface. Source it from Nothing directly
(licence permitting) — do **not** commit the font files to git unless you have
distribution rights.

## Verifying it loaded

In DevTools → Network, filter by "font" and reload. You should see a 200 for
`ndot-55.woff2`. If you see a 404, the file isn't where the @font-face
declaration is looking; check the path in `src/index.css`.
