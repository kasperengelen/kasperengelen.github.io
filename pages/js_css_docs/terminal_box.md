---
layout: page
title: Terminal boxes
permalink: /js_css_docs/terminal_box/
exclude: true
referenceId: js_css_docs_terminal_box
sitemap:
    exclude: true
---

# Terminal Boxes

Terminal boxes provide styling for terminal commands in text. This functionality consists of a `<terminalBox>` element that has the following sub-elements:
- `<tTitle>`: optional terminal title  
- `<tCommand>`: a command entered in the terminal  
- `<tResponse>`: the terminal response/output

Multiple commands and responses can be added in any order.

## Example Terminal Box

A terminal with the `ls` and `echo` commands can be encoded using the following HTML code:
```html
<terminalBox>
  <tTitle>Bash</tTitle>
  <tCommand>ls</tCommand>
  <tResponse>file1.txt  src/  README.md</tResponse>
  <tCommand>echo "hello"</tCommand>
  <tResponse>hello</tResponse>
</terminalBox>
```

When rendered, this looks as follows:

<terminalBox>
  <tTitle>Bash</tTitle>
  <tCommand>ls</tCommand>
  <tResponse>file1.txt  src/  README.md</tResponse>
  <tCommand>echo "hello"</tCommand>
  <tResponse>hello</tResponse>
</terminalBox>

Additionally, the "minimal" version can be encoded as
```html
<terminalBox data-minimal>
  <tTitle>Bash</tTitle>
  <tCommand>ls</tCommand>
  <tResponse>file1.txt  src/  README.md</tResponse>
  <tCommand>echo "hello"</tCommand>
  <tResponse>hello</tResponse>
</terminalBox>
```

This looks as follows:

<terminalBox data-minimal>
  <tTitle>Bash</tTitle>
  <tCommand>ls</tCommand>
  <tResponse>file1.txt  src/  README.md</tResponse>
  <tCommand>echo "hello"</tCommand>
  <tResponse>hello</tResponse>
</terminalBox>

