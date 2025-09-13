---
layout: page
title: Images and figures
permalink: /js_css_docs/images/
exclude: true
referenceId: js_css_docs_images
sitemap:
    exclude: true
---

Last updated: 2025-09-13

This website also supports adding images as figures in a document. Figures can be put next to each other in rows that are then dynamically arranged depending on the screen size. Figures can have captions and numbering. Figures can also be labelled for referencing.

## Examples

### Single image

<div class="fig-row">
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/red.png">
            <figcaption>Centered image.</figcaption>
        </figure>
    </div>
</div>

```html
<div class="fig-row">
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/red.png">
            <figcaption>Centered image.</figcaption>
        </figure>
    </div>
</div>
```

### Single image (wide)

<div class="fig-row">
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/red_wide.png">
            <figcaption>Wide image.</figcaption>
        </figure>
    </div>
</div>

```html
<div class="fig-row">
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/red_wide.png">
            <figcaption>Wide image.</figcaption>
        </figure>
    </div>
</div>
```

### Two images

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="fig2ID">
            <img src="/assets/images/red.png">
            <figcaption>Left image</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/green.png">
            <figcaption>Right image</figcaption>
        </figure>
    </div>
</div>

```html
<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="fig2ID">
            <img src="/assets/images/red.png">
            <figcaption>Left image</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/green.png">
            <figcaption>Right image</figcaption>
        </figure>
    </div>
</div>
```

### Three images

<div class="fig-row">
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/red.png">
            <figcaption>Leftmost figure</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/green.png">
            <figcaption>Middle figure</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/blue.png">
            <figcaption>Rightmost figure with a lot of text that goes on and on and on ...</figcaption>
        </figure>
    </div>
</div>

```html
<div class="fig-row">
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/red.png">
            <figcaption>Leftmost figure</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/green.png">
            <figcaption>Middle figure</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/blue.png">
            <figcaption>Rightmost figure with a lot of text that goes on and on and on ...</figcaption>
        </figure>
    </div>
</div>
```

## Figure labels

Figures can also be labelled, which is useful when referring to them in the surrounding text. This is similar to the `\label{...}` that can be added in LaTeX.

A label can be added by specifying a `figId` attribute of the `figure` tag.

```html
<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="some_figure_label">
            <img src="/assets/images/red.png">
            <figcaption>Centered image.</figcaption>
        </figure>
    </div>
</div>
```

When a label is specified, the `figure` tag is provided with an `id`. The full identifier is the value of the `figId` attribute, prefixed with `fig_`.


## Technical information

All the functionality is implemented in `smartFigures.js`. 

If there are two figures within one document with the same label, then an error message will be displayed. For example:

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="duplicated_label">
            <img src="/assets/images/red.png">
            <figcaption>Centered image.</figcaption>
        </figure>
    </div>
</div>

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="duplicated_label">
            <img src="/assets/images/red.png">
            <figcaption>Centered image.</figcaption>
        </figure>
    </div>
</div>

```html
<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="duplicated_label">
            <img src="/assets/images/red.png">
            <figcaption>Centered image.</figcaption>
        </figure>
    </div>
</div>

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="duplicated_label">
            <img src="/assets/images/red.png">
            <figcaption>Centered image.</figcaption>
        </figure>
    </div>
</div>
```



