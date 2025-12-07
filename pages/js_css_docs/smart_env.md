---
layout: page
title: Smart environments
permalink: /js_css_docs/smart_env/
exclude: true
referenceId: js_css_docs_smart_env
sitemap:
    exclude: true
---

Last updated: 2025-09-15

<div>
{% include smart_link/load_internal_urls.html %}
</div>

The software comes with so-called "smart environments". These are useful to typeset mathematical definitions, theorems, lemmas, examples, and proofs. A smart environment comes with custom HTML tags and is rendered as a <smart-link linkType="int" linkId="js_css_docs_fieldsets">fieldset</smart-link>. 

The smart environments are inspired by the mathematical environments LaTeX, for example:
```latex
\begin{definition}
Some definition \dots
\end{definition}
```

In this document we will first give an overview of the different smart environments. Then, we will introduce more advanced features such as automatic numbering, naming, labelling, and possible error messages.

## Overview

There are currently five different smart enviroments: lemma, theorem, definition, example, and proof. Below we can see an overview of what they look like:

<definition>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus, turpis quis pulvinar auctor, diam ipsum euismod augue, id sodales risus enim eget arcu.

    $$
        I = \int f(x)\,dx
    $$

    Vivamus erat est, elementum a nulla ac, feugiat volutpat est.
</definition>

```html
<definition>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Cras luctus, turpis quis pulvinar auctor, diam ipsum euismod augue, 
    id sodales risus enim eget arcu.

    $$
        I = \int f(x)\,dx
    $$
    
    Vivamus erat est, elementum a nulla ac, feugiat volutpat est.
</definition>
```

<theorem>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus, turpis quis pulvinar auctor, diam ipsum euismod augue, id sodales risus enim eget arcu.

    $$
        I = \int f(x)\,dx
    $$

    Vivamus erat est, elementum a nulla ac, feugiat volutpat est.
</theorem>

```html
<theorem>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Cras luctus, turpis quis pulvinar auctor, diam ipsum euismod augue, 
    id sodales risus enim eget arcu.

    $$
        I = \int f(x)\,dx
    $$

    Vivamus erat est, elementum a nulla ac, feugiat volutpat est.
</theorem>
```

<lemma>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus, turpis quis pulvinar auctor, diam ipsum euismod augue, id sodales risus enim eget arcu.

    $$
        I = \int f(x)\,dx
    $$
    
    Vivamus erat est, elementum a nulla ac, feugiat volutpat est.
</lemma>

```html
<lemma>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Cras luctus, turpis quis pulvinar auctor, diam ipsum euismod augue, 
    id sodales risus enim eget arcu.

    $$
        I = \int f(x)\,dx
    $$

    Vivamus erat est, elementum a nulla ac, feugiat volutpat est.
</lemma>
```

<proof>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus, turpis quis pulvinar auctor, diam ipsum euismod augue, id sodales risus enim eget arcu.

    $$
        I = \int f(x)\,dx
    $$

    Vivamus erat est, elementum a nulla ac, feugiat volutpat est.
</proof>

```html
<proof>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Cras luctus, turpis quis pulvinar auctor, diam ipsum euismod augue, 
    id sodales risus enim eget arcu.

    $$
        I = \int f(x)\,dx
    $$

    Vivamus erat est, elementum a nulla ac, feugiat volutpat est.
</proof>
```

<example>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Cras luctus, turpis quis pulvinar auctor, diam ipsum euismod augue, 
    id sodales risus enim eget arcu.

    $$
        I = \int f(x)\,dx
    $$

    Vivamus erat est, elementum a nulla ac, feugiat volutpat est.
</example>

```html
<example>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Cras luctus, turpis quis pulvinar auctor, diam ipsum euismod augue, 
    id sodales risus enim eget arcu.

    $$
        I = \int f(x)\,dx
    $$
    
    Vivamus erat est, elementum a nulla ac, feugiat volutpat est.
</example>
```


## Automatic numbering

As you might have noticed, the definition, theorem, lemma, and example environments all have numbering. Note that the numbering is separate for every environment.

Below we consider some more environments to see the numbering in action.


<lemma>
    ...
</lemma>

<lemma>
    ...
</lemma>

<definition>
    ...
</definition>

Also interesting is that the proof environment does not 

<proof>
</proof>

<proof>
</proof>


## Naming

Just like in LaTeX environments can be named. The given name will then be displayed in brackets. The name can be encoded in HTML using a `<envName>` tag. For example:

<definition>
    <envName>Hello world</envName>
    The words "Hello world!" are often used by programmers when 
    programming a piece of placeholder code.
</definition>

```html
<definition>
    <envName>Hello world</envName>
    The words "Hello world!" are often used by programmers when 
    programming a piece of placeholder code.
</definition>
```

<proof>
    <envName>Hello world</envName>
    In order to prove that the words "Hello world" are common, 
    it suffices to ask a few of your colleagues whether they have ever 
    done a <code>print("Hello world!)</code> in Python.
</proof>

```html
<proof>
    <envName>Hello world</envName>
    In order to prove that the words "Hello world" are common, 
    it suffices to ask a few of your colleagues whether they have ever 
    done a <code>print("Hello world!)</code> in Python.
</proof>
```

## Labelling

In LaTeX, one can use `\label{some_example}` to label an environment. This is useful when one wants to refer somewhere in the text to a theorem, for example.

Smart environments also support this. In our case these are useful for both referring to the environment in the text, using a smart reference, or for bookmarking the environment.

For example:

<definition envId="a_definition_label">
    ...
</definition>

```html
<definition envId="a_definition_label">
    ...
</definition>
```

The label can thus be specified by adding an `envId` attribute to the `definition` tag. Labelling also works for theorems, lemmas, and examples.

Another interesting feature is that when an environment is labelled, then the title becomes clickable. 

Labels and environment names can also be combined:

<theorem envId="label_and_name">
    <envName>Some title</envName>
    Environment with label and name.
</theorem>

```html
<theorem envId="label_and_name">
    <envName>Some title</envName>
    Environment with label and name.
</theorem>
```

## Possible error messages and technical information

All this functionality is implemented in the Javascript file `smartEnvironments.js`. When a label `xyz` is given to an environment, it is prefixed before being encoded in the HTML. The possible prefixes are:
- theorem: `thm_`
- lemma: `lem_`
- definition: `def_`
- example: `ex_`

The smart environment software also ensures that all specified labels within one document are unique. In case of a duplicated label, an error message is displayed. For example:

<definition envId="duplicate_label">
    First occurrence of the label.
</definition>

<definition envId="duplicate_label">
    Second occurrence of the label.
</definition>

```html
<definition envId="duplicate_label">
    First occurrence of the label.
</definition>

<definition envId="duplicate_label">
    Second occurrence of the label.
</definition>
```

