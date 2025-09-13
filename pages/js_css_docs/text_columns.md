---
layout: page
title: Text and columns
permalink: /js_css_docs/text_columns/
exclude: true
referenceId: js_css_docs_text_columns
sitemap:
    exclude: true
---

There is support for columns of text, including columns with different widths.

For example, if we want two columns with equal widths, we can do the following:

```html
<div class="col-container" id="col_demo">
    <div class="col-content-1">
        <h2>First</h2>
        <p>...</p>
    </div>
    <div class="col-content-1">
        <h2>Second</h2>
        <p>...</p>
    </div>
</div>
```

We can also add a third column:
```html
<div class="col-container" id="col_demo">
    <div class="col-content-1">
        <h2>First</h2>
        <p>...</p>
    </div>
    <div class="col-content-1">
        <h2>Second</h2>
        <p>...</p>
    </div>
    <div class="col-content-1">
        <h2>Third</h2>
        <p>...</p>
    </div>
</div>
```

Finally, different columns can be assigned different widths. In the following example the first column will be 1/3 and the second column will be 2/3 of the width of the page.
```html
<div class="col-container" id="col_demo">
    <div class="col-content-1">
        <h2>First</h2>
        <p>...</p>
    </div>
    <div class="col-content-2">
        <h2>Second</h2>
        <p>...</p>
    </div>
</div>
```



## Overview

<tableOfContents></tableOfContents>

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

## Three Columns

<div class="col-container" id="col_demo">
    <div class="col-content-1">
        <h2>On the left</h2>
        <p>turpis enim, elementum quis accumsan nec, molestie vel diam. Maecenas eget vulputate orci. Aliquam tristique, libero quis facilisis imperdiet, odio felis posuere diam, vitae tempor neque urna ut risus. Aliquam erat volutpat. Integer laoreet vestibulum tincidunt. Aliquam erat volutpat. Aliquam porta viverra elit suscipit volutpat. Donec vitae magna nec purus pretium auctor nec vel leo. Morbi egestas efficitur metus, sit amet aliquet nulla commodo vitae. Maecenas augue felis, accumsan a orci tincidunt, gravida iaculis arcu. Donec quam massa, rhoncus a vestibulum vitae, tincidunt condimentum dolor. Morbi ultricies magna purus, ut aliquam erat malesuada eu. Integer mattis lacus dictum, volutpat arcu et, tincidunt mi.</p>
    </div>
    <div class="col-content-1">
        <h2>.. in the middle ...</h2>
        <p>Nunc interdum porttitor erat, in fermentum nisl ultricies tincidunt. Integer auctor purus id metus tempor, ac lacinia nibh dapibus. Nulla sed magna et lacus rhoncus mollis. Praesent quis sem eget purus sagittis ullamcorper. Morbi quis imperdiet ipsum. Nunc vehicula scelerisque magna sit amet ornare. Nulla sed porttitor mauris, id laoreet lacus. Nam vel sapien sit amet ipsum placerat dapibus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam vel urna felis. Duis auctor, orci eget ultrices efficitur, massa mi mattis dui, ullamcorper iaculis orci orci in augue. Curabitur id diam tincidunt, viverra lacus in, tincidunt purus. Quisque neque odio, viverra in posuere congue, mollis mollis lorem. </p>
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
