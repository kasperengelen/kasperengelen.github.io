---
layout: page
title: Automatic title numbering
permalink: /js_css_docs/title_numbering/
exclude: true
referenceId: js_css_docs_title_numbering
sitemap:
    exclude: true
---

<div>
{% include enable_title_numbering.html %}
</div>

The software package that powers this website also offers automatic numbering of titles, up to three levels deep.

In case you wish to have automatic numbering in your document, you should add the following HTML code to the beginning of the text, right below the Jekyll header:

```html
<div>
{% raw %}{% include enable_title_numbering.html %}{% endraw %}
</div>
```

Titles can be added in the usual way using `#`:

```md
## Level A
Text 1
### Level B1
Text 2
### Level B2
Text 3
#### Level C
Text 4
```

The titles will then automatically be prefixed with a number while rendering the document:

```
1. Level A
----------

Text 1

1.1. Level B1
-------------

Text 2

1.2. Level B1
-------------

Text 3

1.2.1. Level C
--------------

Text 4
```

All titles are also automatically given a unique identifier, and they are transformed into clickable hyperlinks. This is very useful for bookmarking specific parts of your document.

Finally, this numbering is fully compatible with the automatically generated table contents, which can be added to the document with the following HTML code:
```html
<tableOfContents></tableOfContents>
```

## Demo

<tableOfContents></tableOfContents>

## A title

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vitae ultricies nisi. Aliquam pulvinar, ante id cursus aliquam, ex tellus blandit turpis, ut euismod quam dui nec tellus. Suspendisse semper fringilla odio, id consectetur ligula elementum ut. Maecenas euismod imperdiet felis, vel suscipit odio. Nam eget luctus risus, eget molestie odio. Integer augue lorem, condimentum in nisi eget, blandit sodales arcu. Nunc ultrices mi nisi, eu dictum lectus elementum ac. Aenean aliquam nisl ut nisl ornare vulputate vel condimentum risus. Proin in ullamcorper metus, ut finibus neque.

### Section A

Ut maximus elementum nunc, sit amet tristique nulla imperdiet at. Vivamus dapibus sed nibh non rhoncus. Nam nec justo consequat, imperdiet lorem sed, pellentesque odio. Aliquam molestie fermentum dignissim. Nullam venenatis nibh at mi dictum, suscipit placerat sapien semper. Praesent consequat tortor ipsum, id feugiat lorem accumsan a. Aliquam erat volutpat.

#### Sub-section 1

Morbi accumsan diam purus, ut lobortis elit efficitur nec. Aenean non arcu sit amet massa congue tincidunt ut eget libero. Maecenas fringilla velit at justo imperdiet, quis porttitor purus dapibus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec maximus, ex sit amet fringilla venenatis, metus sapien accumsan nunc, non dignissim tellus leo quis neque. Nullam lectus urna, accumsan eu suscipit vitae, mattis nec nisi. Integer consequat felis nulla, vel congue ligula tincidunt at. Ut in hendrerit nibh. Duis quis auctor justo, a aliquet orci. Etiam bibendum purus sed urna sodales semper quis sit amet orci. Vestibulum molestie ex vel erat suscipit maximus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam erat volutpat.

Ut venenatis augue eros, in consequat mauris rutrum ut. Aliquam erat volutpat. Phasellus accumsan mi neque, sit amet vehicula nibh porttitor in. Aenean lobortis dolor ac commodo iaculis. Proin id orci volutpat felis blandit varius. Fusce nunc libero, vehicula nec orci id, ornare cursus dui. Cras consectetur maximus lacus nec elementum. Sed non magna rhoncus, semper sem ut, imperdiet augue. Donec vehicula id lorem at malesuada. Fusce sed placerat mi. Maecenas venenatis erat ac lorem eleifend, eu fermentum turpis dapibus.

#### Sub-section 2

In arcu turpis, congue sed nunc ut, pretium volutpat libero. Nullam sapien justo, interdum at ex nec, vulputate euismod sem. Curabitur quis velit turpis. Nunc sagittis, libero eget elementum pellentesque, metus arcu pellentesque enim, nec tristique magna nisl quis felis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras viverra velit sit amet magna sollicitudin, eget tristique massa porttitor. Nam in ullamcorper risus. Ut ut lectus facilisis lectus placerat dictum eget nec erat. Donec imperdiet dui eget gravida molestie. Suspendisse lacinia ante arcu.

Curabitur nibh purus, elementum tincidunt massa quis, dictum volutpat dui. Nullam pretium tincidunt lobortis. Phasellus at malesuada massa. In turpis massa, cursus nec laoreet eget, rhoncus eu justo. Pellentesque eu risus tortor. Donec non enim eu nibh feugiat ultricies ut eu diam. Donec id maximus lorem. Nullam sodales libero mi, sit amet consequat ligula consectetur nec. Duis id magna enim. Proin in erat turpis. Praesent sit amet sem eget nisl scelerisque fermentum ac non nunc. Pellentesque vitae euismod nulla, at vehicula dui. Pellentesque posuere mauris vitae lobortis molestie. Sed at accumsan justo.

#### Sub-section 3

Quisque lorem mauris, bibendum in eleifend nec, pretium id tellus. Sed erat ante, sagittis sollicitudin dictum id, commodo sed tortor. Nullam vitae tellus fermentum, luctus nibh id, lacinia quam. Maecenas laoreet dictum finibus. Praesent dui ipsum, auctor et semper ut, mattis vitae felis. Donec fringilla turpis sit amet velit dignissim facilisis. Nullam eu sem et magna egestas consectetur. Sed at lacus at erat viverra facilisis.

Quisque sollicitudin dolor mauris, sit amet lacinia augue imperdiet eget. Sed eget turpis finibus, commodo leo at, vestibulum ipsum. Donec in consectetur arcu. In hac habitasse platea dictumst. Vestibulum auctor orci turpis. Morbi congue odio ante, vel mattis odio venenatis a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus quis sapien ac diam scelerisque consequat at iaculis elit. Donec euismod enim quis nunc efficitur vulputate. Nunc urna eros, ultricies a nisl ut, eleifend aliquam velit. Proin dapibus ac elit eget imperdiet. Nullam tincidunt, sem nec congue tincidunt, sem lacus condimentum tortor, quis fringilla sapien ante id dui. Donec nec ligula vitae urna sodales mollis. Donec augue lectus, fermentum id porttitor sed, mattis et mauris. Nulla eget lectus est.

#### Sub-section 4

Morbi dignissim enim nisl. Integer tincidunt justo ac arcu volutpat, eget tincidunt diam ullamcorper. Nullam tempus lobortis elit, sed pretium felis finibus in. Praesent porttitor auctor odio id accumsan. Ut dapibus arcu condimentum nulla facilisis rhoncus. Integer vehicula orci quis ligula pulvinar eleifend. Pellentesque mi nulla, commodo ac molestie egestas, luctus vitae elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas efficitur eget nulla quis eleifend. Donec eget ullamcorper nunc. Nulla facilisi. Curabitur ante tellus, egestas eu dui at, ornare gravida metus. Phasellus non fringilla elit.

Proin porttitor accumsan justo vulputate faucibus. Sed quis mauris posuere, luctus odio eu, ullamcorper urna. In massa turpis, fringilla ac ante quis, volutpat tempor nunc. Duis a eros quis massa luctus pulvinar id non velit. Vivamus efficitur eu dolor in dictum. Nam imperdiet mauris id augue luctus interdum. Curabitur pellentesque, tellus sit amet auctor porta, massa ante tristique dolor, fermentum gravida felis turpis quis quam. Cras placerat lectus lorem. Integer eu erat at quam eleifend vehicula ac at nulla. Cras dignissim feugiat commodo. Nullam dictum sapien a porta bibendum. Vestibulum et tincidunt lectus, ac sagittis dui.

### Section B

Fusce euismod egestas massa in suscipit. In consequat eu augue ut accumsan. Nulla convallis faucibus dolor, et ultricies nibh tempus quis. Pellentesque hendrerit vehicula egestas. Nunc elit elit, molestie sed tincidunt eu, aliquet eu sapien. Nulla facilisi. Vestibulum vel lacus vel erat bibendum vulputate.

Aenean venenatis neque eu magna finibus facilisis. Maecenas convallis, ipsum non tristique malesuada, metus turpis vulputate augue, eget facilisis nunc lorem non lorem. In sollicitudin laoreet feugiat. Proin id venenatis neque, at fringilla turpis. Duis finibus maximus massa, id aliquam diam pulvinar ornare. Phasellus efficitur, turpis aliquam vestibulum sagittis, metus libero semper dui, a interdum sem sem nec mi. Sed turpis diam, consequat nec eros nec, faucibus venenatis arcu. Vivamus sollicitudin laoreet lectus. Morbi porttitor tempus nulla eu convallis. Nullam mi lacus, tristique in neque in, pharetra dignissim ipsum. Pellentesque vitae nisl urna. Nulla iaculis vulputate urna. Vivamus velit dolor, sagittis a urna eget, suscipit interdum elit.

### Section C

Cras facilisis ultrices nisi a blandit. Suspendisse eget egestas quam, scelerisque vehicula libero. Suspendisse mollis tortor vitae lectus mollis tempor. Pellentesque ultricies nisi vel enim feugiat, in suscipit libero varius. Aliquam consectetur tristique odio, at tempor libero venenatis vel. Maecenas sem tellus, scelerisque sit amet nisi ut, laoreet elementum lectus. Vestibulum ultrices libero ut elit lobortis, non fringilla eros tempus. Sed sem lectus, eleifend nec tempus in, facilisis eu nunc. Etiam venenatis euismod gravida. Maecenas tempus molestie odio, sit amet rutrum urna varius vel. Proin sem purus, suscipit id tellus at, interdum hendrerit magna. Vivamus orci magna, semper hendrerit consequat eu, hendrerit a libero. Nulla facilisi.

## Second title

Aliquam facilisis a nulla ac volutpat. Aenean finibus, urna eget tincidunt ullamcorper, massa mauris egestas tortor, ac sagittis libero tellus et nibh. Duis in urna nulla. Nulla lectus justo, mollis eu turpis eget, fermentum volutpat justo. Praesent consequat tortor tellus, sed consectetur arcu dictum sit amet. Nullam sit amet efficitur nisl. Quisque viverra pharetra dignissim.

## Third title

Morbi et libero rutrum, posuere odio in, porttitor ex. Aenean quam ligula, fringilla ut dapibus vitae, auctor ut eros. Integer justo sapien, consectetur nec malesuada et, luctus nec risus. Proin blandit in nisl sed rhoncus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec eget magna aliquam, iaculis libero ac, mollis mi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam luctus imperdiet metus ac pellentesque. Phasellus finibus lorem ex, sed lobortis sem mollis in. Sed volutpat nisi ipsum, quis hendrerit urna sodales eget. Nullam fringilla leo in orci blandit faucibus. Aliquam pulvinar eu elit in vehicula. Vivamus vehicula sit amet est sed hendrerit. Maecenas ut bibendum ante.

## Fourth title

Donec maximus erat eu mattis luctus. Sed rutrum feugiat libero, mattis ullamcorper lacus commodo ac. Cras porta magna eget rutrum accumsan. Aliquam vel mattis ante, pulvinar porttitor nisl. Praesent sit amet metus at tellus blandit finibus. Ut vel arcu aliquam, efficitur tellus a, consequat leo. Aenean vel fermentum justo, id suscipit purus. Pellentesque pellentesque dapibus quam ac ornare. Suspendisse potenti. Vestibulum molestie leo eu ex venenatis, ut pharetra velit ornare. Mauris vitae placerat ex, a mattis urna. In et euismod metus, eget convallis risus.

## Final title

Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi laoreet nunc ut nisi vulputate accumsan. Vivamus iaculis arcu et elementum scelerisque. Sed nec magna commodo, aliquet nunc in, tristique arcu. Pellentesque et mauris sapien. Vestibulum et feugiat mi, mollis euismod lorem. Nunc nunc tortor, rhoncus id bibendum quis, convallis non purus. Etiam pretium ornare consequat. Ut scelerisque libero leo, sed auctor leo convallis a. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.

Maecenas a nisi vitae nunc auctor pellentesque. Vivamus viverra ipsum vitae imperdiet efficitur. Aliquam tristique, leo vel suscipit posuere, ligula nibh molestie nulla, et tempus leo libero varius erat. Sed malesuada lobortis mollis. Proin bibendum pulvinar nunc, ut interdum nisl luctus eget. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam dapibus felis eu metus pellentesque pretium. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam cursus turpis in ante posuere auctor. Nullam sit amet nisi neque. Sed mi diam, mattis in pellentesque nec, facilisis non massa. Aenean sodales eu lectus id fermentum.
