---
layout: page
title: Smart references
permalink: /js_css_docs/smart_ref/
exclude: true
referenceId: js_css_docs_smart_ref
sitemap:
    exclude: true
---

Last updated: 2025-09-15

<div>
{% include smart_link/load_internal_urls.html %}
</div>

In this demo we will go over so-called <em>smart references</em>. These smart references allow you to create clickable links inside your text that link to various smart environments and figures in the same document.

The functionality is dynamic. This means that even if you move things around, the links will keep working as intended. It is also easy to specify links, since links use the labels of the environments and figures.

The smart reference system is based on Cleveref from LaTeX. If one defines an environment in LaTeX with a label `\label{xyz}`, then this environment can be referenced with `\Cref{xyz}`.

## Smart environments

We will first consider referencing the smart environments. For the smart references there exists a <smart-link linkId="js_css_docs_smart_env" linkType="int">dedicated page</smart-link> with documentation.

<definition envId="def_a">
    ...
</definition>

```html
<definition envId="def_a">
    ...
</definition>
```

<theorem envId="theorem_a">
    ...
</theorem>

```html
<theorem envId="theorem_a">
    ...
</theorem>
```

<lemma envId="lemma_a">
    ...
</lemma>

```html
<lemma envId="lemma_a">
    ...
</lemma>
```

<example envId="example_a">
    ...
</example>

```html
<example envId="example_a">
    ...
</example>
```

We can make smart references to definitions (<smart-ref targetType="def" targetId="def_a"></smart-ref>), theorems (<smart-ref targetType="thm" targetId="theorem_a"></smart-ref>), lemmas (<smart-ref targetType="lem" targetId="lemma_a"></smart-ref>), and examples (<smart-ref targetType="ex" targetId="example_a"></smart-ref>).

The HTML codes for these are as follows:
- definitions: `<smart-ref targetType="def" targetId="def_a"></smart-ref>`,
- theorems: `<smart-ref targetType="thm" targetId="theorem_a"></smart-ref>`,
- lemmas: `<smart-ref targetType="lem" targetId="lemma_a"></smart-ref>`,
- examples: `<smart-ref targetType="ex" targetId="example_a"></smart-ref>`.

As you can see the general syntax is 
```html
<smart-ref targetType="TYPE" targetId="IDENTIFIER"></smart-ref>
```

The `targetType` attribute specifies the type of environment that we are referring to: definition (`def`), theorem (`thm`), lemma (`lem`), and example (`ex`). The `targetId` attribute specifies the identifier of the environment, which can be specified with the `envId` attribute of the environment.

Up until now, we have only referenced environments that appeared earlier in the text. However, it is also possible to refer to environments that are ahead:
- definitions (<smart-ref targetType="def" targetId="def_b"></smart-ref>), 
- theorems (<smart-ref targetType="thm" targetId="theorem_b"></smart-ref>), 
- lemmas (<smart-ref targetType="lem" targetId="lemma_b"></smart-ref>), and 
- examples (<smart-ref targetType="ex" targetId="example_b"></smart-ref>).

Finally, it is possible to specify custom text for the hyperlink:
- definitions: <smart-ref targetType="def" targetId="def_a">Some definition</smart-ref>

```html
<smart-ref targetType="def" targetId="def_a">Some definition</smart-ref>
```

- theorems: <smart-ref targetType="thm" targetId="theorem_a">Another theorem</smart-ref>, 

```html
<smart-ref targetType="thm" targetId="theorem_a">Another theorem</smart-ref>
```

- lemmas: <smart-ref targetType="lem" targetId="lemma_a">some environment</smart-ref>, and 

```html
<smart-ref targetType="lem" targetId="lemma_a">some environment</smart-ref>
```

- examples: <smart-ref targetType="ex" targetId="example_a">last example</smart-ref>.

```html
<smart-ref targetType="ex" targetId="example_a">last example</smart-ref>
```

<definition envId="def_b">
    ...
</definition>

```html
<definition envId="def_b">
    ...
</definition>
```

<theorem envId="theorem_b">
    ...
</theorem>

```html
<theorem envId="theorem_b">
    ...
</theorem>
```

<lemma envId="lemma_b">
    ...
</lemma>

```html
<lemma envId="lemma_b">
    ...
</lemma>
```

<example envId="example_b">
    ...
</example>

```html
<example envId="example_b">
    ...
</example>
```

## Figures

Similarly to the smart environments, the smart references are also compatible with smart figures. How to add figures to a document is described in the <smart-link linkId="js_css_docs_images" linkType="int">smart figures documentation</smart-link>. Let us start by defining a figure:

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="some_figure">
            <img src="/assets/images/red.png">
            <figcaption>Image with identifier.</figcaption>
        </figure>
    </div>
</div>


```html
<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="some_figure">
            <img src="/assets/images/red.png">
            <figcaption>Image with identifier.</figcaption>
        </figure>
    </div>
</div>
```

We can then link back to <smart-ref targetType="fig" targetId="some_figure"></smart-ref> using the following HTML code:

```html
<smart-ref targetType="fig" targetId="some_figure"></smart-ref>
```

When referring to figures, the `targetId` attribute of the `<smart-ref>` tag refers to the `figId` attribute of the `<figure>` tag.

Aside from referring the figure by its number, we can also add <smart-ref targetType="fig" targetId="some_figure">custom labels</smart-ref> to figures:

```html
<smart-ref targetType="fig" targetId="some_figure">custom labels</smart-ref>
```

Finally, it is also possible to refer to figures that appear later in the text. For example, we can see <smart-ref targetType="fig" targetId="another_figure"></smart-ref> below:

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="another_figure">
            <img src="/assets/images/red.png">
            <figcaption>Second image.</figcaption>
        </figure>
    </div>
</div>

```html
<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="another_figure">
            <img src="/assets/images/red.png">
            <figcaption>Second image.</figcaption>
        </figure>
    </div>
</div>
```

## Tables

This is a functionality that will be added in the future.


## Technical information

The smart reference functionality is implemented in `smartReference.js`.

If the `targetType` attribute does not contain a valid value, then an error is displayed: <smart-ref targetType="hamburger" targetId="tasty_burger"></smart-ref>

```html
<smart-ref targetType="hamburger" targetId="tasty_burger"></smart-ref>
```

If the `targetId` contains an identifier for which there is no smart environment or figure with that same identifier, an error is displayed: <smart-ref targetType="fig" targetId="third_figure"></smart-ref>

```html
<smart-ref targetType="fig" targetId="third_figure"></smart-ref>
```

Finally, if the `targetId` or `targetType` attributes are missing, the appropriate error is displayed:
- missing `targetType`: <smart-ref targetId="smart_theorem"></smart-ref>
- missing `targetId`: <smart-ref targetType="def"></smart-ref>

```html
<smart-ref targetId="smart_theorem"></smart-ref>
<smart-ref targetType="def"></smart-ref>
```
