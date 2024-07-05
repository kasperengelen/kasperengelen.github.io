/* This script will take some custom tags and replace them with divs */

function replaceEnvironmentWithCounter(tagName, environmentName) {
    /* TODO, not only save the identifier of the environment, but also the name. This way smart-ref can also include
    the name of the environment for better readabililty. */

    /* We create an object that maps the HTML id of the environment, to the sequential number of the environment. */
    var environmentIdToNr = new Object();
    $(tagName).each(function(i) {
        var envNr = i + 1;

        var replacement = "";

        /* if the environment has an id, then we copy that id to the newly created div. */
        if(this.hasAttribute("id")) {
            var idAttr = $(this).attr('id');

            /* Check for duplicate identifiers. */
            if ((idAttr in environmentIdToNr)) {
                replacement += "<span style=\"color: red; background: yellow;\"><strong>ERROR: DUPLICATE ID '" + idAttr + "' FOR ENVIRONMENT '" + environmentName + "'.</strong></span><br>";
            }
            environmentIdToNr[idAttr] = envNr;

            replacement += "<div id=\"" + idAttr + "\">";
        } else {
            replacement += "<div>";
        }

        /* if the environment has an id, then we add a hyperlink in black. */
        if(this.hasAttribute("id")) {
            /* make clickable link. */
            var idAttr = $(this).attr('id');
            replacement += "<p><strong><a href=\"#" + idAttr + "\" style=\"color: black;\">" + environmentName + " " + envNr + "</a></strong>";
        } else {
            replacement += "<p><strong>" + environmentName + " " + envNr + "</strong>";
        }

        /* add optional name in parenthesis. Useful for theorems and definitions */
        if(this.hasAttribute("name")) {
            var nameAttr = $(this).attr('name');
            replacement += " (" + nameAttr + ")";
        }

        /* Dot at the end of the environment title. */
        replacement += ".";

        /* NOTE: this only works properly if we pass a lambda. Otherwise, the MathJAX content is not rendered properly. */
        $(this).replaceWith(function(i, content) { return replacement + "<br><i>" + content +  "</i></p></div>"; });
    });
    return environmentIdToNr;
};

/**
 * Replace all occurences of the specified tag with a "highlight box".
 * 
 * The specified tag can take an optional attribute "title". If specified, a <h3> element will be inserted with the title.
 */
function replaceCustomTagWithHighlightBox(tagName, highLightBoxClass) {
    $(tagName).each(function(i) {
        if(this.hasAttribute("title")) {
            var titleAttr = $(this).attr('title');
            /* NOTE: this only works properly if we pass a lambda. Otherwise, the MathJAX content is not rendered properly. */
            $(this).replaceWith(function(i, content) { return "<div class=\"" + highLightBoxClass + "\"><h3>" + titleAttr + "</h3>\n" + content +  "</div>"});

        } else {
            /* NOTE: this only works properly if we pass a lambda. Otherwise, the MathJAX content is not rendered properly. */
            $(this).replaceWith(function(i, content) { return "<div class=\"" + highLightBoxClass + "\">" + content +  "</div>"});
        }
    });
};

/**
 * Replace all occurences of the specified tag with a "fieldset" box.
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

    replaceCustomTagWithFieldset("example-box", "fs-blue", "Example");
    replaceCustomTagWithFieldset("warning-box", "fs-yellow", "Warning");

    /* process and replace custom environments */
    var definitions = replaceEnvironmentWithCounter("definition", "Definition");
    var lemmas = replaceEnvironmentWithCounter("lemma", "Lemma");
    var theorems = replaceEnvironmentWithCounter("theorem", "Theorem");

    /* proofs are less advanced and not linkable, so we process then separately. */
    $("proof").each(function(i) {
        var defNr = i + 1;
        
        /* NOTE: this only works properly if we pass a lambda. Otherwise, the MathJAX content is not rendered properly. */
        $(this).replaceWith(function(i, content) { return "<p><i>Proof:</i><br>" + content +  "&nbsp;&nbsp;&#x25A1</p>"});
    
    });

    $("smart-ref").each(function(i) {
        var refTypeAttr = $(this).attr('refType');
        var environmentName = "";
        /* The container that will be used to map string ids to environment numbers */
        var idMapperContainer = null;

        /* Figure out what type of reference this is, and retrieve the appropriate id-mapper */
        if (refTypeAttr === "theorem") {
            environmentName = "Theorem";
            idMapperContainer = theorems;
        } else if (refTypeAttr === "definition") {
            environmentName = "Definition";
            idMapperContainer = definitions;
        } else if (refTypeAttr === "lemma") {
            environmentName = "Lemma";
            idMapperContainer = lemmas;
        } else {
            /* Error message */
            $(this).replaceWith(function(i, content) { return "<span style=\"color: red; background: yellow;\"><strong>ERROR: INVALID ENVIRONMENT TYPE '" + refTypeAttr + "'.</strong></span>"; });
            return;
        }

        /* retrieve the id of the referenced environment and check if it exists. */
        var envIdAttr = $(this).attr('envId');
        if (!(envIdAttr in idMapperContainer)) {
            /* Error message */
            $(this).replaceWith(function(i, content) { return "<span style=\"color: red; background: yellow;\"><strong>ERROR: INVALID ENVIRONMENT ID '" + envIdAttr + "' FOR TYPE '" + refTypeAttr + "'.</strong></span>"; });
            return;
        }

        envNr = idMapperContainer[envIdAttr];

        /* Construct full HTML replacement code. */

        /* Perform replacement. We use a lambda since otherwise MathJax stops functioning. */
        $(this).replaceWith(function(j, content) { 
            if (content === "") {
                return "<strong><a style=\"color: black;\" href=\"#" + envIdAttr + "\">" + environmentName + " " + envNr + "</a></strong>"; 
            } else {
                return "<strong><a href=\"#" + envIdAttr + "\">" + content + "</a></strong>"; 
            }
            
        });
    });
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

