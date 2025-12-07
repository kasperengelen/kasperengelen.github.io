---
layout: page
title: CSS Demo
permalink: /js_css_docs/css_demo/
exclude: true
referenceId: js_css_docs_old
sitemap:
    exclude: true
---

<div>
{% include smart_cite/load_bib_file.html bib_file=site.data.bibliography_css_demo %}
</div>

<div>
{% include smart_link/load_url_file.html url_file=site.data.external_urls_css_demo %}
</div>

<div>
{% include smart_link/load_internal_urls.html %}
</div>

## Overview

* TOC 
{:toc}

## Two Columns

<div class="col-container" id="col_demo">
    <div class="col-content-1">
        <h2>On the left</h2>
        <p>turpis enim, elementum quis accumsan nec, molestie vel diam. Maecenas eget vulputate orci. Aliquam tristique, libero quis facilisis imperdiet, odio felis posuere diam, vitae tempor neque urna ut risus. Aliquam erat volutpat. Integer laoreet vestibulum tincidunt. Aliquam erat volutpat. Aliquam porta viverra elit suscipit volutpat. Donec vitae magna nec purus pretium auctor nec vel leo. Morbi egestas efficitur metus, sit amet aliquet nulla commodo vitae. Maecenas augue felis, accumsan a orci tincidunt, gravida iaculis arcu. Donec quam massa, rhoncus a vestibulum vitae, tincidunt condimentum dolor. Morbi ultricies magna purus, ut aliquam erat malesuada eu. Integer mattis lacus dictum, volutpat arcu et, tincidunt mi.</p>
    </div>
    <div class="col-content-1">
        <h2>And to the right</h2>
        <p>Nunc interdum porttitor erat, in fermentum nisl ultricies tincidunt. Integer auctor purus id metus tempor, ac lacinia nibh dapibus. Nulla sed magna et lacus rhoncus mollis. Praesent quis sem eget purus sagittis ullamcorper. Morbi quis imperdiet ipsum. Nunc vehicula scelerisque magna sit amet ornare. Nulla sed porttitor mauris, id laoreet lacus. Nam vel sapien sit amet ipsum placerat dapibus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam vel urna felis. Duis auctor, orci eget ultrices efficitur, massa mi mattis dui, ullamcorper iaculis orci orci in augue. Curabitur id diam tincidunt, viverra lacus in, tincidunt purus. Quisque neque odio, viverra in posuere congue, mollis mollis lorem. </p>
    </div>
</div>

## Uneven Columns

<div class="col-container" id="col_demo">
    <div class="col-content-1">
        <h2>On the left</h2>
        <p>turpis enim, elementum quis accumsan nec, molestie vel diam. Maecenas eget vulputate orci. Aliquam tristique, libero quis facilisis imperdiet, odio felis posuere diam, vitae tempor neque urna ut risus. Aliquam erat volutpat. Integer laoreet vestibulum tincidunt. Aliquam erat volutpat. Aliquam porta viverra elit suscipit volutpat. Donec vitae magna nec purus pretium auctor nec vel leo. Morbi egestas efficitur metus, sit amet aliquet nulla commodo vitae. Maecenas augue felis, accumsan a orci tincidunt, gravida iaculis arcu. Donec quam massa, rhoncus a vestibulum vitae, tincidunt condimentum dolor. Morbi ultricies magna purus, ut aliquam erat malesuada eu. Integer mattis lacus dictum, volutpat arcu et, tincidunt mi.</p>
    </div>
    <div class="col-content-2">
        <h2>And to the right</h2>
        <p>Nunc interdum porttitor erat, in fermentum nisl ultricies tincidunt. Integer auctor purus id metus tempor, ac lacinia nibh dapibus. Nulla sed magna et lacus rhoncus mollis. Praesent quis sem eget purus sagittis ullamcorper. Morbi quis imperdiet ipsum. Nunc vehicula scelerisque magna sit amet ornare. Nulla sed porttitor mauris, id laoreet lacus. Nam vel sapien sit amet ipsum placerat dapibus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam vel urna felis. Duis auctor, orci eget ultrices efficitur, massa mi mattis dui, ullamcorper iaculis orci orci in augue. Curabitur id diam tincidunt, viverra lacus in, tincidunt purus. Quisque neque odio, viverra in posuere congue, mollis mollis lorem. </p>
    </div>
</div>

## Images

In this demo you can see different images position next to each other in a row. This is dynamic, meaning that the number of images can be arbitrary and that each image has identical CSS, regardless of the number of images per row. Additionally, the figure numbers in the captions are automatically generated.

### Single image

<div class="fig-row">
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/red.png">
            <figcaption>Centered image.</figcaption>
        </figure>
    </div>
</div>

### Single image (wide)

<div class="fig-row">
    <div class="fig-in-row">
        <figure>
            <img src="/assets/images/red_wide.png">
            <figcaption>Wide image.</figcaption>
        </figure>
    </div>
</div>

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

## Highlight boxes

<div class="section-box">
    <h3>Title</h3>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    $$I = \int f(x)\,dx$$
</div>

<div class="highlight-box-white">
    <h3>Title</h3>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    $$I = \int f(x)\,dx$$
    
</div>

<div class="highlight-box-gray">
    <h3>Title</h3>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    $$I = \int f(x)\,dx$$

</div>

<div class="highlight-box-purple">
    <h3>Title</h3>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    $$I = \int f(x)\,dx$$

</div>

<div class="highlight-box-red">
    <h3>Title</h3>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    $$I = \int f(x)\,dx$$
</div>

<div class="highlight-box-blue">
    <h3>Title</h3>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    $$I = \int f(x)\,dx$$

</div>

<div class="highlight-box-green">
    <h3>Title</h3>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    $$I = \int f(x)\,dx$$

</div>

<div class="highlight-box-yellow">
    <h3>Title</h3>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    $$I = \int f(x)\,dx$$

</div>

## Custom fieldsets

<div class="fs-blue">
    <fieldset>
        <legend>Example</legend>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

        $$I = \int f(x)\,dx$$

    </fieldset>
</div>

<div class="fs-green">
    <fieldset>
        <legend>Example</legend>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

        $$I = \int f(x)\,dx$$

    </fieldset>
</div>

<div class="fs-yellow">
    <fieldset>
        <legend>Example</legend>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

        $$I = \int f(x)\,dx$$

    </fieldset>
</div>

<div class="fs-red">
    <fieldset>
        <legend>Example</legend>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

        $$I = \int f(x)\,dx$$

    </fieldset>
</div>

<div class="fs-purple">
    <fieldset>
        <legend>Example</legend>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

        $$I = \int f(x)\,dx$$

    </fieldset>
</div>

<div class="fs-orange">
    <fieldset>
        <legend>Example</legend>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

        $$I = \int f(x)\,dx$$

    </fieldset>
</div>

## Custom HTML tags using jQuery

The following is accessible with `<example envName="Some example">...</example>`.

<example envName="Some example">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    $$I = \int f(x)\,dx$$

</example>

<example>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    $$I = \int f(x)\,dx$$

</example>

The following is accessible with `<warning-box title="Warning!">...</warning-box>`.

<warning-box title="Warning!">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    $$I = \int f(x)\,dx$$

</warning-box>

The following is accessible with `<todo-box>...</todo-box>`.

<todo-box>
Some text about something that needs to be done ...
</todo-box>

Paragraph before table.

<smartTable>
    <tableCaption>Some information about the table.</tableCaption>
    <table>
        <thead><tr>
            <th>X</th>
            <th>Y</th>
            <th>Z</th>
        </tr></thead>
        <tbody>
            <tr>
                <td>x1</td>
                <td>y1</td>
                <td>z1</td>
            </tr>
            <tr>
                <td>x2</td>
                <td>y2</td>
                <td>z2</td>
            </tr>
            <tr>
                <td>$\sqrt{x_3}$</td>
                <td>$\sqrt{y_3}$</td>
                <td>$\sqrt{z_3}$</td>
            </tr>
        </tbody>
    </table>
</smartTable>

Paragraph after table.

This is a normal paragraph with a <texttt>monospace</texttt> word in it. This is text with some inline maths $\frac{S}{dx} = S\cdot I$ as well as display maths:

$$f(x) = x^2 + 3568x$$

Display maths are done using `$$...$$`, inline maths can be styled using `$...$`.

The following is accessible with `<warning-box>...</warning-box>`. The `title` attribute is optional.

<warning-box>
All of this also works within a highlight box.

This is a different text with a <texttt>typewriter</texttt> word in it. This is text with some inline maths $\frac{R}{dx} = S\cdot I$ as well as display maths:

$$\mathbf{E}(x) = \int \mathbf{P}(\omega) d\omega$$

</warning-box>

## Definition, Theorem, Lemma, and Proof using jQuery

In this section we will demonstrate various LaTeX-like environments, implemented using CSS and jQuery. Possible environments include definitions, theorems, lemma, and proofs. Each environment, except proofs, can have a name and a unique identifier. The identifier can, in turn, be used in comdination with a so-called "smart reference", in order to refer to specific defitions, theorems, or lemmas throughout the document. 

<strong>Source:</strong> These definitions and theorems all come from the book "Understanding Analysis" by Stephen Abbott.

<definition envName="$\varepsilon$-neighborhood" envId="eps_neighborhood">
Given $a \in \mathbb{R}$ and $\varepsilon > 0$, the $\varepsilon$-neighborhood of $a$ is the set

$$
    V_\varepsilon(a) = \{ x \in \mathbb{R} : \left| x - a \right| < \varepsilon \}.
$$

</definition>

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat.

<definition envId="eps_neighborhood_2">
    <envName>$\varepsilon$-neighborhood, from <smart-cite bibId="understanding_analysis"></smart-cite></envName>
    
Given $a \in \mathbb{R}$ and $\varepsilon > 0$, the $\varepsilon$-neighborhood of $a$ is the set

$$
    V_\varepsilon(a) = \{ x \in \mathbb{R} : \left| x - a \right| < \varepsilon \}.
$$

</definition>

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat <smart-ref targetType="thm" targetId="limit_point_thm"></smart-ref> nulla pariatur. Excepteur sint occaecat <smart-ref targetType="thm" targetId="limit_point_thm">Click here for thm 2!</smart-ref> cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

<definition envId="open_set">
A set \(O \subseteq \mathbb{R}\) is <i>open</i> if for all points \(a \in O\) there exists an \(\varepsilon\)-neighborhood \(V_\varepsilon(a) \subseteq O\).
</definition>

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

<theorem envName="Union and intersection of open sets">
<ol>
    <li>The union of an arbitrary collection of open sets is open.</li>
    <li>The intersection of a finite collection of open sets is open.</li>
</ol>
</theorem>

<proof>
See the book Understanding Analysis by Stephen Abbott, theorem 3.2.3.
</proof>

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

<definition>
A point \(x\) is the <i>limit point</i> of a set \(A\) if every \(\varepsilon\)-neighborhood \(V_\varepsilon(x)\) of \(x\) intersects the set \(A\) in some point other than \(x\).
</definition>

<theorem envName="From Understanding Analysis, theorem 3.2.5" envId="limit_point_thm">
A point \(x\) is a limit point of a set \(A\) if and only if \(x = \lim a_n\) for some sequence \((a_n)\) contained in \(A\) satisfying \(a_n \neq x\) for all \(n \in \mathbb{N}\).
</theorem>

The proof is left as an exercise to the reader.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut <smart-ref targetType="def" targetId="eps_neighborhood"></smart-ref> labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit <smart-ref targetType="def" targetId="some_def"></smart-ref> in voluptate velit esse
cillum dolore <smart-ref targetType="zefize"></smart-ref> eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="AnotherFig">
            <img src="/assets/images/red.png">
            <figcaption>Left image</figcaption>
        </figure>
    </div>
</div>

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt <smart-ref targetType="fig" targetId="Some_fig"></smart-ref> ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in <smart-ref targetType="fig" targetId="AnotherFig"></smart-ref> reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="Some_fig">
            <img src="/assets/images/red.png">
            <figcaption>Left image</figcaption>
        </figure>
    </div>
</div>

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.



<lemma envId="some_lemma">Some lemma.</lemma>
<lemma envId="some_lemma">Second lemma.</lemma>

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.


<div class="fig-row">
    <div class="fig-in-row">
        <figure figId="fig2ID">
            <img src="/assets/images/red.png">
            <figcaption>Left image</figcaption>
        </figure>
    </div>
    <div class="fig-in-row">
        <figure figId="fig2ID">
            <img src="/assets/images/green.png">
            <figcaption>Right image</figcaption>
        </figure>
    </div>
</div>


<div class="fig-row">
    <div class="fig-in-row">
        <figure>
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


## Mobile-friendly math

$$
\mathrm{adj}(A)b = \begin{bmatrix}
A & B & \dots & C \\
D & E & \dots & F \\
\dots & \dots & \dots & \dots \\
G & H & \dots & I
\end{bmatrix} = \begin{bmatrix}
A & B & \dots & C \\
D & E & \dots & F \\
\dots & \dots & \dots & \dots \\
G & H & \dots & I
\end{bmatrix} = \begin{bmatrix}
A & B & \dots & C \\
D & E & \dots & F \\
\dots & \dots & \dots & \dots \\
G & H & \dots & I
\end{bmatrix} = \begin{bmatrix}
A & B & \dots & C \\
D & E & \dots & F \\
\dots & \dots & \dots & \dots \\
G & H & \dots & I
\end{bmatrix} = \begin{bmatrix}
A & B & \dots & C \\
D & E & \dots & F \\
\dots & \dots & \dots & \dots \\
G & H & \dots & I
\end{bmatrix} = \begin{bmatrix}
A & B & \dots & C \\
D & E & \dots & F \\
\dots & \dots & \dots & \dots \\
G & H & \dots & I
\end{bmatrix} = \begin{bmatrix}
A & B & \dots & C \\
D & E & \dots & F \\
\dots & \dots & \dots & \dots \\
G & H & \dots & I
\end{bmatrix} 
$$

This also works in combination with custom environments, such as `theorem`.

<theorem>
<p>Nunc interdum porttitor erat, in fermentum nisl ultricies tincidunt. Integer auctor purus id metus tempor, ac lacinia nibh dapibus. Nulla sed magna et lacus rhoncus mollis. Praesent quis sem eget purus sagittis ullamcorper. Morbi quis imperdiet ipsum. Nunc vehicula scelerisque magna sit amet ornare. Nulla sed porttitor mauris, id laoreet lacus. Nam vel sapien sit amet ipsum placerat dapibus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam vel urna felis. Duis auctor, orci eget ultrices efficitur, massa mi mattis dui, ullamcorper iaculis orci orci in augue. Curabitur id diam tincidunt, viverra lacus in, tincidunt purus. Quisque neque odio, viverra in posuere congue, mollis mollis lorem. </p>

$$
\mathrm{adj}(A)b = \begin{bmatrix}
A & B & \dots & C \\
D & E & \dots & F \\
\dots & \dots & \dots & \dots \\
G & H & \dots & I
\end{bmatrix} = \begin{bmatrix}
A & B & \dots & C \\
D & E & \dots & F \\
\dots & \dots & \dots & \dots \\
G & H & \dots & I
\end{bmatrix} = \begin{bmatrix}
A & B & \dots & C \\
D & E & \dots & F \\
\dots & \dots & \dots & \dots \\
G & H & \dots & I
\end{bmatrix} = \begin{bmatrix}
A & B & \dots & C \\
D & E & \dots & F \\
\dots & \dots & \dots & \dots \\
G & H & \dots & I
\end{bmatrix} = \begin{bmatrix}
A & B & \dots & C \\
D & E & \dots & F \\
\dots & \dots & \dots & \dots \\
G & H & \dots & I
\end{bmatrix} = \begin{bmatrix}
A & B & \dots & C \\
D & E & \dots & F \\
\dots & \dots & \dots & \dots \\
G & H & \dots & I
\end{bmatrix} = \begin{bmatrix}
A & B & \dots & C \\
D & E & \dots & F \\
\dots & \dots & \dots & \dots \\
G & H & \dots & I
\end{bmatrix} 
$$

</theorem>

## Bibliography

<bibliography>
</bibliography>

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla <smart-cite bibId="understanding_analysis"></smart-cite>  pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt <smart-cite bibId="some_reference"></smart-cite> ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor <smart-cite bibId="attention"></smart-cite> in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur <smart-cite bibId="hoeffding_ineq"></smart-cite> sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco <smart-cite bibId="model_checking_book"></smart-cite> laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, <smart-cite bibId="model_checking_book"></smart-cite> consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit <smart-cite bibId="understanding_analysis"></smart-cite> in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Smart links

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis <smart-link linkType="ext" linkId="css_demo_page">CSS DEMO PAGE</smart-link> nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. <smart-link linkType="ext" linkId="uantwerpen_website">UA Website</smart-link> Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt <smart-link linkType="int" linkId="css_demo_page">CSS DEMO PAGE</smart-link> ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor <smart-link linkType="int" linkId="css_demo_page"></smart-link> sit amet, consectetur adipisicing elit, sed do eiusmod
tempor <smart-link linkType="local" linkId="custom-fieldsets">Link to an element</smart-link> incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in <smart-link linkType="local" linkId="">Link to an element</smart-link> voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum <smart-link linkType="local" linkId="thm_limit_point_thm">Some label</smart-link> dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in <smart-link linkType="abc" linkId="css_demo_page">Some label</smart-link> voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.





