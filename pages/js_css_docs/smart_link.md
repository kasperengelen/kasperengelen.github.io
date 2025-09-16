---
layout: page
title: Smart links
permalink: /js_css_docs/smart_link/
exclude: true
referenceId: js_css_docs_smart_link
sitemap:
    exclude: true
---

<div>
{% include smart_link/load_internal_urls.html %}
</div>


<div>
{% include smart_link/load_url_file.html url_file=site.data.external_urls_docs_smart_link %}
</div>

Adding clickable hyperlinks is important when guiding the reader towards useful information. This software provides functionality to label pages and URLs with identifiers, and to create links that refer to those identifiers.

There are three types of hyperlinks:
- internal: to pages on this website,
- external: to URLs located on other websites, and
- local: to objects (i.e., HTML tags with an identifier) on the same page.

## Internal links

In order to link to a page, the target page needs to have a `referenceId` property as part of its metadata. The metadata is specified at the top of the markdown code of that page.

Secondly, the page that contains the hyperlink needs to have the following piece of HTML code at the top of the document:
```html
<div>
{% raw %}{% include smart_link/load_internal_urls.html %}{% endraw %}
</div>
```

Once all that is done, we can add the actual hyperlink in the text. The syntax is always
```html
<smart-link linkType="int" linkId="IDENTIFIER">
```

Here, the `linkId` attribute contains the same value as the `referenceId` property of the page that we are referring to. The `linkType` is set to `int` when linking to internal pages. For example:
```html
<smart-link linkType="int" linkId="forward_euler">
```

As an example we will now consider a small piece of text: We will refer to our post on <smart-link linkType="int" linkId="forward_euler">forward Euler</smart-link> as well as the <smart-link linkType="int" linkId="swift_package_manager">Swift tutorial</smart-link>. On the <smart-link linkType="int" linkId="blog_overview">blog overview</smart-link> page, we can see an overview of the blogposts. It is also possible for a page to contain <smart-link linkType="int" linkId="js_css_docs_smart_link">a link to this page itself</smart-link>.


## External links

It is also possible to link to external pages. To do so, we first need to have a YAML file in the `_data` directory of the website. In this tutorial we will use the file `_data/external_urls_docs_smart_link.yml`. 

The contents of this file are the following:
```yml
- identifier: wikipedia
  url: https://www.wikipedia.org

- identifier: google
  url: https://www.google.com

- identifier: wiki_mathematics
  url: https://en.wikipedia.org/wiki/Mathematics
```

This file can be loaded by putting the following HTML code at the top of the page where we wish to add the hyperlinks:
```html
<div>
{% raw %}{% include smart_link/load_url_file.html url_file=site.data.external_urls_docs_smart_link %}{% endraw %}
</div>
```

It is possible to load multiple YAML files with URLs in the same document.

Once all that is done, we can add the actual hyperlink. We can add a <smart-link linkType="ext" linkId="wikipedia">link to Wikipedia</smart-link>, for example:

```html
<smart-link linkType="ext" linkId="wikipedia">link to Wikipedia</smart-link>
```

For external links, the `linkType` attribute is set to `ext`, and the `linkId` attribute refers the `identifier` property in the YAML file.

Note that all external links open in a new tab or window.

## Local links

A third and final hyperlink functionality is the possibility to link to HTML objects within the same document. The target must have an HTML object identifier. This identifier can, for example, be specified using the `id` attribute of an HTML tag.

We can then <smart-link linkType="local" linkId="some_identifier">create a hyperlink</smart-link> to the HTML object.

```html
<smart-link linkType="local" linkId="some_identifier">create a hyperlink</smart-link>
```

### Some example section

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec placerat id quam vel luctus. Vivamus at turpis velit. Sed vel mollis neque. Maecenas ultrices tristique lobortis. Curabitur accumsan ligula et nisi facilisis cursus. Sed varius id felis vel malesuada. Nulla sed urna id mi fermentum hendrerit. Vivamus aliquet consequat lectus in sodales. Nullam at est elementum, porta dui vitae, egestas quam. Quisque porta porttitor est, eget elementum leo porta eu.


<div id="some_identifier" style="border: solid black; background: yellow">
  A div with identifier "<tt>some_identifier</tt>" placed in the middle of the text.
</div>

```html
<div id="some_identifier" style="border: solid black; background: yellow">
  A div with identifier "<tt>some_identifier</tt>" 
  placed in the middle of the text.
</div>
```

 Suspendisse potenti. Vestibulum posuere nibh sit amet blandit sollicitudin. Cras faucibus sem quis nisl volutpat blandit. Mauris lacinia felis felis, nec cursus neque maximus vel. Suspendisse ut augue quis nulla pellentesque vehicula eget vel elit. Donec ac nisi augue. Praesent ac urna at nibh tincidunt porta. 

### Another example section

Donec vehicula lobortis nisi, ac varius nisl interdum eget. In hac habitasse platea dictumst. Praesent ullamcorper vitae quam a eleifend. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum sit amet nisi cursus, blandit magna et, sagittis nulla. Etiam interdum quam dapibus tellus lacinia, id efficitur orci pharetra. Nunc facilisis nunc ac dictum dictum. Aliquam a metus euismod ipsum pellentesque aliquet. 

Fusce ornare malesuada dolor posuere convallis. Aliquam dictum, velit at consectetur laoreet, lorem purus aliquet eros, at finibus leo odio in est. Curabitur dolor erat, faucibus eget velit non, iaculis convallis elit. Suspendisse non est pretium, malesuada metus in, dictum risus. Vestibulum placerat risus est, eu interdum lorem dignissim at. Nam facilisis dui eu rutrum porttitor. 


## Technical information

All this functionality is implemented in `smartLink.js`.

- No internal URLs loaded: <span style="color: red; background: yellow;"><strong>ERROR: NO INTERNAL URLS LOADED!</strong></span>
- Missing `linkType` attribute: <smart-link linkId="forward_euler">some link label</smart-link>
- Invalid value for `linkType`: <smart-link linkType="abc" linkId="forward_euler">some link label</smart-link>
- Missing `linkId` attribute: <smart-link linkType="ext">some link label</smart-link>
- No page or URL exists with the specified `linkId` attribute value: <smart-link linkId="some_page" linkType="ext">some link label</smart-link>
