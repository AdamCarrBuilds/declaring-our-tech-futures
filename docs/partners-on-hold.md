# Coalition partners on hold

Partners removed from the "Our emerging coalition" section of `index.html` while we wait for permission to list them.
To turn one back on, paste its pieces back into place and commit.

## Electronic Frontier Foundation (EFF)

Status: waiting on EFF's permission to be listed (removed Oct 20, 2026). The logo file `assets/eff.svg` is still in the repo.

**1. Caption** — replace the `<p class="r-caption">` line in the coalition section with:

```html
<p class="r-caption">Early coalition partners include the Electronic Frontier Foundation (EFF) and BLOOM.</p>
```

**2. Logo card** — paste as the first item inside `<div class="r-logos">`, above the BLOOM card:

```html
<a class="r-logo r-glow r-settle" href="https://www.eff.org/" target="_blank" rel="noopener"><img src="assets/eff.svg" alt="Electronic Frontier Foundation" style="width: 300px;"><span class="sr-only"> (opens in a new tab)</span></a>
```
