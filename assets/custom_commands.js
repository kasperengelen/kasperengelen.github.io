

/**
 * Replace all occurrences of the specified tag with a "highlight box".
 * 
 * The specified tag can take an optional attribute "title". If specified, a <h3> element will be inserted with the title.
 */
function replaceCustomTagWithHighlightBox(tagName, highLightBoxClass) {
    $(tagName).each(function(i) {
        if(this.hasAttribute("title")) {
            var titleAttr = $(this).attr("title");
            /* NOTE: this only works properly if we pass a lambda. Otherwise, the MathJAX content is not rendered properly. */
            $(this).replaceWith(function(i, content) { return "<div class=\"" + highLightBoxClass + "\"><h3>" + titleAttr + "</h3>\n" + content +  "</div>"});

        } else {
            /* NOTE: this only works properly if we pass a lambda. Otherwise, the MathJAX content is not rendered properly. */
            $(this).replaceWith(function(i, content) { return "<div class=\"" + highLightBoxClass + "\">" + content +  "</div>"});
        }
    });
};

/**
 * Replace all occurrences of the specified tag with a "fieldset" box.
 * 
 * The specified tag can take an optional attribute "title". If specified, a <legend> element will be inserted with the title. If not specified
 * a <fieldset> element will be inserted with the 'defaultTitle' argument.
 */
function replaceCustomTagWithFieldset(tagName, fieldsetParentDivClass, defaultTitle) {
    $(tagName).each(function(i) {
        if(this.hasAttribute("title")) {
            var titleAttr = $(this).attr('title');
            /* NOTE: this only works properly if we pass a lambda. Otherwise, the MathJAX content is not rendered properly. */
            $(this).replaceWith(function(i, content) { return "<div class=\"" + fieldsetParentDivClass + "\"><fieldset>\n<legend>" + titleAttr + "</legend>\n" + content +  "</fieldset></div>"});

        } else {
            /* NOTE: this only works properly if we pass a lambda. Otherwise, the MathJAX content is not rendered properly. */
            $(this).replaceWith(function(i, content) { return "<div class=\"" + fieldsetParentDivClass + "\"><fieldset>\n<legend>" + defaultTitle + "</legend>\n" + content +  "</fieldset></div>"});
        }
    });
};


$(document).ready(function () {
    /* Custom tags */
    // replaceCustomTagWithHighlightBox("example-box", "highlight-box-gray");
    // replaceCustomTagWithHighlightBox("warning-box", "highlight-box-yellow");

    replaceCustomTagWithHighlightBox("todo-box", "highlight-box-blue");
    replaceCustomTagWithFieldset("warning-box", "fs-yellow", "Warning");
    replaceCustomTagWithFieldset("note-box", "fs-blue", "Note");


    /* Make each h2 with an 'id' attribute clickable */
    $("h2").each(function(i) {
        if(this.hasAttribute("id")) {
            var currentContent = $(this).text()
            var idAttr = $(this).attr('id');
            $(this).replaceWith("<h2 id=\"" + idAttr + "\"><a style=\"color: black;\" href=\"#" + idAttr + "\">" + currentContent + "</a></h2>");

        }
    });

    /* Make each h3 with an 'id' attribute clickable */
    $("h3").each(function(i) {
        if(this.hasAttribute("id")) {
            var currentContent = $(this).text()
            var idAttr = $(this).attr('id');
            $(this).replaceWith("<h3 id=\"" + idAttr + "\"><a style=\"color: black;\" href=\"#" + idAttr + "\">" + currentContent + "</a></h3>");

        }
    });

    $("texttt").replaceWith(function(i, content) {
        return "<code>" + content + "</code>"
    });

    /* NOTE: these come last, such that all custom stuff that uses math can make use of MathJAX.*/
    $("display-math").replaceWith(function(i, content) {
        return "$$" + content + "$$"
    });

    $("inline-math").replaceWith(function(i, content) {
        return "\\(" + content + "\\)"
    });
});
