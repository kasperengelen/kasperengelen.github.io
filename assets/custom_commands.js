
/**
 * Contains information about an environment including the HTML object,
 * identifier, name, and number.
 */
class EnvironmentInfo {
    constructor(domObj, envId, envName, envNumber) {
        this._domObj = domObj;
        this._envId = envId;
        this._envName = envName;
        this._envNumber = envNumber;
    }

    /**
     * The HTML object.
     */
    get domObj() {
        return this._domObj;
    }

    /**
     * The textual identifier of the environment.
     */
    get envId() {
        return this._envId;
    }

    /**
     * The human-readable name of the environment.
     */
    get envName() {
        return this._envName;
    }

    /**
     * A sequential and unique associated with the environment for easy reference.
     */
    get envNumber() {
        return this._envNumber;
    }
}

/**
 * Iterates over all objects with the specified tag name, and collects information about them.
 * 
 * If the tag contains an "envId" attribute, this will be stored. The prefix "<idPrefix>_" will be added,
 * in order to group environment identifiers in namespaces.
 * 
 * Returns an array of 'EnvironmentInfo' objects.
 */
function collectEnvironments(tagName, idPrefix) {
    envs = [];
    $(tagName).each(function(i) {
        // 'i' is zero indexed
        var environmentNumber = i + 1;

        // retrieve optional environment identifier
        environmentId = null;
        if(this.hasAttribute("envId")) {
            environmentId = idPrefix + "_" + $(this).attr("envId");
        }

        // retrieve optional environment name
        environmentName = null;
        if(this.hasAttribute("envName")) {
            environmentName = $(this).attr("envName");
        }

        envs.push(new EnvironmentInfo(this, environmentId, environmentName, environmentNumber));
    });

    return envs;
}

/**
 * Replace all the specified environments and their associated HTML objects with a fieldset with custom CSS.
 * 
 * If the environment has an identifier, then the fieldset legend will be clickable and the parent div of
 * the fieldset will have the same identifier.
 * 
 * The CSS class of the div enclosing the fieldset is given by 'fieldsetParentDivClass'.
 * 
 * If 'useNumbering' is true, the fieldset legend will contain the environment number.
 */
function renderEnvironmentsAsFieldset(environments, titlePrefix, fieldsetParentDivClass, useNumbering) {
    var seenEnvironmentIds = new Set();

    for(const env of environments) {

        // example: "Theorem 2"
        if(useNumbering) {
            var environmentTitle = titlePrefix + " " + env.envNumber;
        } else {
            var environmentTitle = titlePrefix;
        }

        if(env.envName != null) {
            // example: "Definition 6 (Convexity)"
            environmentTitle += " (" + env.envName + ")";
        }

        if(env.envId == null) {
            // construct parent div
            var parentDivOpenTag = "<div class=\"" + fieldsetParentDivClass + "\">";
        } else {
            // construct parent div, including identifier
            var parentDivOpenTag = "<div class=\"" + fieldsetParentDivClass + "\" id=\"" + env.envId + "\">";

            // wrap title contents in a hyperlink
            environmentTitle =  "<a href=\"#" + env.envId + "\" style=\"color: white;\">" + environmentTitle + "</a>";
        }

        var duplicateId = false;
        if(env.envId != null && seenEnvironmentIds.has(env.envId)) {
            duplicateId = true;
        } else {
            seenEnvironmentIds.add(env.envId);
        }

        $(env.domObj).replaceWith(function(j, content) {
            let fieldsetCode = parentDivOpenTag + "\n" + "<fieldset><legend>" + environmentTitle + "</legend>" + "\n<p>" + content + "</p></fieldset></div>";

            if (duplicateId) {
                let warningMessage = "<span style=\"color: red; background: yellow;\"><strong>ERROR: DUPLICATE ID '" + env.envId + "' FOR ENVIRONMENT.</strong></span><br>";
                return warningMessage + fieldsetCode;
            } else {
                return fieldsetCode;
            }
        });
    }
}

/**
 * Replace all the specified environments and their associated HTML objects with HTML code that resembles the 
 * LaTeX style for theorems, lemmas, and definitions. This is not suitable for proofs.
 * 
 * If the environment has an identifier, then the title will be clickable and the parent div of
 * the paragraph will have the same identifier.
 * 
 * If 'useNumbering' is true, the title will contain the environment number.
 */
function renderEnvironmentsInLaTeXStyle(environments, titlePrefix, useNumbering) {
    var seenEnvironmentIds = new Set();

    for(const env of environments) {

        // example: "Theorem 2"
        if(useNumbering) {
            var environmentTitle = titlePrefix + " " + env.envNumber;
        } else {
            var environmentTitle = titlePrefix;
        }

        environmentTitle = "<strong>" + environmentTitle + "</strong>";

        if(env.envName != null) {
            // example: "Definition 6 (Convexity)"
            environmentTitle += " (" + env.envName + ")";
        }

        environmentTitle += ".";

        if(env.envId == null) {
            // construct parent div
            enclosingDivOpenTag = "<div>";
        } else {
            // construct parent div, including identifier
            enclosingDivOpenTag = "<div id=\"" + env.envId + "\">";

            // wrap title contents in a hyperlink
            environmentTitle =  "<a href=\"#" + env.envId + "\" style=\"color: black;\">" + environmentTitle + "</a>";
        }

        var duplicateId = false;
        if(env.envId != null && seenEnvironmentIds.has(env.envId)) {
            duplicateId = true;
        } else {
            seenEnvironmentIds.add(env.envId);
        }

        $(env.domObj).replaceWith(function(j, content) {
            let fieldsetCode = enclosingDivOpenTag + "\n" + "<p>" + environmentTitle + "<br><i>" + content + "</i></p></div>";

            if (duplicateId) {
                let warningMessage = "<span style=\"color: red; background: yellow;\"><strong>ERROR: DUPLICATE ID '" + env.envId + "' FOR ENVIRONMENT '" + environmentName + "'.</strong></span><br>";
                return warningMessage + fieldsetCode;
            } else {
                return fieldsetCode;
            }
        });
    }
}

/**
 * Replace all the specified environments and their associated HTML objects with HTML code that resembles the 
 * LaTeX style for proofs.
 * 
 * If the environment has an identifier, then the title will be clickable and the parent div of
 * the paragraph will have the same identifier.
 * 
 * If 'useQED' is true, then the proof will end with a right-aligned "Q.E.D.", otherwise
 * the proof will end with a right-aligned white tombstone.
 */
function renderProofInLaTeXStyle(environments, useQED) {
    var seenEnvironmentIds = new Set();

    for(const env of environments) {

        var environmentTitle = "Proof";

        if(env.envName != null) {
            // example: "Proof (theorem 6)"
            environmentTitle += " (" + env.envName + ")";
        }

        if(env.envId == null) {
            // construct parent div
            enclosingDivOpenTag = "<div>";
        } else {
            // construct parent div, including identifier
            enclosingDivOpenTag = "<div id=\"" + env.envId + "\">";

            // wrap title contents in a hyperlink
            environmentTitle =  "<a href=\"#" + env.envId + "\" style=\"color: black;\">" + environmentTitle + "</a>";
        }

        environmentTitle = "<i>" + environmentTitle + ":</i>";

        var duplicateId = false;
        if(env.envNumber != null && seenEnvironmentIds.has(env.envNumber)) {
            duplicateId = true;
        } else {
            seenEnvironmentIds.add(env.envNumber);
        }

        if(useQED) {
            var endOfProofMarker = "Q.E.D.";
        } else {
            var endOfProofMarker = "&#x25A1";
        }

        $(env.domObj).replaceWith(function(j, content) {
            let fieldsetCode = enclosingDivOpenTag + "\n" + "<div><p>" + environmentTitle + "<br>" + content + "</p></div><div><p style=\"text-align: right;\">" + endOfProofMarker + "</p></div></div>";

            if (duplicateId) {
                let warningMessage = "<span style=\"color: red; background: yellow;\"><strong>ERROR: DUPLICATE ID '" + env.envId + "' FOR ENVIRONMENT '" + environmentName + "'.</strong></span><br>";
                return warningMessage + fieldsetCode;
            } else {
                return fieldsetCode;
            }
        });
    }
}

/**
 * Class that contains information about something that can be referenced.
 */
class ReferenceTarget {
    constructor(typeLabel, targetNumber, targetName) {
        this._typeLabel = typeLabel;
        this._targetNumber = targetNumber;
        this._targetName = targetName;
    }

    /**
     * Human-readable name of the type of the target. Example: "Theorem", "Figure", etc.
     */
    get targetTypeLabel() {
        return this._typeLabel;
    }

    /**
     * A number that can be added after the label. Example: 1 for "Theorem 1", 87 for "Figure 87", etc.
     */
    get targetNumber() {
        return this._targetNumber;
    }

    /**
     * A human-readable name that can also be added after the label.
     * 
     * Example "Measure" for "Definition 5 (Measure)".
     */
    get targetName() {
        return this._targetName;
    }
}


/**
 * Contains information about reference targets, grouped by type.
 */
class ReferenceTargetContainer {
    constructor() {
        this._refContainers = new Object();
        this._typeLabels = new Object();
    }

    /**
     * Add a new target type. This will allow targets of that type to be added to 
     * the reference container.
     */
    addTargetType(targetType) {
        this._refContainers[targetType] = new Object();
    }

    /**
     * Add a new reference target of the specified type with the specified identifier.
     */
    addRefTarget(targetType, targetId, targetInfo) {
        this._refContainers[targetType][targetId] = targetInfo;
    }

    /**
     * Check if the specified reference target type exists.
     */
    existsTargetType(targetType) {
        return (targetType in this._refContainers);
    }

    /**
     * Check if a reference target exists of the specified type with the specified identifier.
     */
    hasRefTarget(targetType, targetId) {
        return (targetId in this._refContainers[targetType]);
    }

    /**
     * Retrieve the reference target of the specified type with the specified identifier.
     * 
     * Returns object of type 'ReferenceTarget'.
     */
    getRefTarget(targetType, targetId) {
        return this._refContainers[targetType][targetId];
    }
}

/**
 * Add the environments to the reference target container. For each environment a ReferenceTarget object
 * will be constructed.
 * 
 * 'container': the reference container
 * 'environments': the EnvironmentInfo objects.
 * 'environmentType': the short-name of the environment (e.g., "thm" for "Theorem")
 * 'environmentTypeLabel': the full human-friendly name of the environment (e.g., "Definition", "Theorem")
 */
function addEnvironmentsToReferenceContainer(container, environments, environmentType, environmentTypeLabel) {
    for(env of environments) {
        if (env.envId == null) {
            continue;
        }
        let refTarget = new ReferenceTarget(environmentTypeLabel, env.envNumber, env.envName);
        container.addRefTarget(environmentType, env.envId, refTarget);
    }
}

/**
 * Add the figures to the reference target container. For each figure a ReferenceTarget object
 * will be constructed.
 */
function addFiguresToReferenceContainer(container, figures) {
    for (fig of figures) {
        if(fig.figId == null) {
            continue;
        }
        let refTarget = new ReferenceTarget("Fig.", fig.figNumber, null);
        container.addRefTarget("fig", fig.figId, refTarget);
    }
}


/**
 * Contains information about a smart reference.
 */
class SmartRef {
    constructor(domObj, targetType, targetId, includeName) {
        this._domObj = domObj;
        this._refTargetType = targetType;
        this._refTargetId = targetId;
        this._includeName = includeName;
    }

    /**
     * The HTML object that represents the smart reference.
     */
    get domObj() {
        return this._domObj;
    }

    /**
     * The type of target that the smart reference refers to (e.g., theorem, definition, ...).
     */
    get targetType() {
        return this._refTargetType;
    }

    /**
     * The identifier of the referenced target.
     */
    get targetId() {
        return this._refTargetId;
    }

    /**
     * Whether the name of the referenced target should be rendered as part of the smart reference.
     */
    get includeName() {
        return this._includeName;
    }
}

/**
 * Traverses the HTML document to find "smart-ref" tags. A list of
 * SmartRef objects is returned.
 */
function collectSmartReferences() {
    var smartRefs = [];

    $("smart-ref").each(function(i) {
        var targetTypeAttr = $(this).attr("targetType");
        var targetIdAttr = targetTypeAttr + "_" + $(this).attr("targetId");

        var includeName = false;
        if(this.hasAttribute("includeEnvName")) {
            var flagValue = $(this).attr("includeEnvName");

            if(flagValue === "true") {
                includeName = true;
            }
        }

        smartRefs.push(new SmartRef(this, targetTypeAttr, targetIdAttr, includeName));
    });

    return smartRefs;
}

/**
 * Given a list of a SmartRef objects, and a ReferenceContainter, this will properly render
 * all the smart references.
 * 
 * If smart references are encountered that refer to an object not present in the ReferenceContainer,
 * a warning will be rendered instead.
 */
function renderSmartRefs(smartRefs, referenceContainer) {
    for(const smartRef of smartRefs) {

        // check if ref type exists
        if(!referenceContainer.existsTargetType(smartRef.targetType)) {
            $(smartRef.domObj).replaceWith(function(i, content) { 
                return "<span style=\"color: red; background: yellow;\"><strong>ERROR: INVALID TARGET TYPE '" + smartRef.targetType + "'.</strong></span>";
            });
            continue;
        }

        // check if env id exists
        if(!referenceContainer.hasRefTarget(smartRef.targetType, smartRef.targetId)) {
            $(smartRef.domObj).replaceWith(function(i, content) { 
                return "<span style=\"color: red; background: yellow;\"><strong>ERROR: INVALID TARGET ID '" + smartRef.targetId + "' FOR TYPE '" + smartRef.targetType + "'.</strong></span>";
            });
            continue;
        }

        var refTargetInfo = referenceContainer.getRefTarget(smartRef.targetType, smartRef.targetId);

        // Example: "Theorem" for "thm", "Defintion" for "def", ...
        var linkTitle = refTargetInfo.targetTypeLabel

        if(refTargetInfo.targetNumber != null) {
            linkTitle = linkTitle + " " + refTargetInfo.targetNumber;
        }

        // optionally include the name of the environment
        if(smartRef.includeName && refTargetInfo.targetName != null) {
            var targetName = refTargetInfo.targetName;
            linkTitle = linkTitle + " (" + targetName + ")";
        }

        // check if an optional label exists
        $(smartRef.domObj).replaceWith(function(i, content) { 
            if (content === "") {
                // TODO: do we want this in black? This might be confusing for the reader ...
                return "<strong><a href=\"#" + smartRef.targetId + "\">" + linkTitle + "</a></strong>"; 
            } else {
                // if a label is specified, then we use that label instead of the target title.
                return "<strong><a href=\"#" + smartRef.targetId + "\">" + content + "</a></strong>"; 
            }
        });
    }
}

/**
 * Replace all occurences of the specified tag with a "highlight box".
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

/**
 * Contains information about a figure.
 */
class FigureInfo {
    constructor(figDomObj, capDomObj, figNumber, figId) {
        this._figDomObj = figDomObj;
        this._capDomObj = capDomObj;
        this._figNumber = figNumber;
        this._figId = figId;
    }

    /**
     * Retrieve the figure HTML object.
     */
    get figureDomObj() {
        return this._figDomObj;
    }

    /**
     * Retrieve the figcaption HTML object.
     */
    get captionDomObj() {
        return this._capDomObj;
    }

    /**
     * Retrieve the unique and sequential figure number.
     */
    get figNumber() {
        return this._figNumber;
    }

    /**
     * Retrieve the optional user-specified figure identifier.
     */
    get figId() {
        return this._figId;
    }
}

/**
 * Collect information about all the figures in the document.
 * 
 * If the figure element contains a "figId" attribute, this will be stored. 
 * The prefix "fig_" will be added to the identifier, in order to group figures in their
 * own namespace.
 */
function collectFigures() {
    figs = [];
    $("figcaption").each(function (i) {
        // zero indexed.
        let figNumber = i + 1;

        // retrieve parent
        let parentElement = $(this).parent()[0];

        var figId = null;
        if(parentElement.hasAttribute("figId")) {
            figId = "fig_" + $(parentElement).attr("figId");
        }

        figs.push(new FigureInfo(parentElement, this, figNumber, figId));
    });

    return figs;
}

/**
 * Add the figure number to the captions of the figures.
 * 
 * In case of duplicate figure identifiers, a warning will be added below the figure.
 */
function processFigures(figures) {
    var seenFigureIds = new Set();
    for (fig of figures) {

        if(fig.figId != null && seenFigureIds.has(fig.figId)){
            let warningParagraphCode = "<p style=\"text-align: left;\"><span style=\"color: red; background: yellow;\"><strong>ERROR: DUPLICATE FIGURE ID '" + fig.figId + "'.</strong></span></p>";
            fig.figureDomObj.insertAdjacentHTML('beforeend', warningParagraphCode);
        } else {
            seenFigureIds.add(fig.figId);
        }

        // if a figure identifier is specified, an "id" attribute is added to the
        //  figure element.
        if(fig.figId != null) {
            $(fig.figureDomObj).attr("id", fig.figId);
        }

        $(fig.captionDomObj).text(function(i, content) {
            return "Fig. " + fig.figNumber + " \u2013 " + content;
        });
    }
}

$(document).ready(function () {
    /* Custom tags */
    // replaceCustomTagWithHighlightBox("example-box", "highlight-box-gray");
    // replaceCustomTagWithHighlightBox("warning-box", "highlight-box-yellow");

    replaceCustomTagWithHighlightBox("todo-box", "highlight-box-blue");

    replaceCustomTagWithFieldset("example-box", "fs-blue", "Example");
    replaceCustomTagWithFieldset("warning-box", "fs-yellow", "Warning");

    // TODO: we still need to check for duplicate env ids across different env types. We can do this by adding "prefixes": "lem_", "thm_", "def_", "proof_"
    // process and replace custom math environments
    lemmaEnvs = collectEnvironments("lemma", "lem");
    theoremEnvs = collectEnvironments("theorem", "thm");
    definitionEnvs = collectEnvironments("definition", "def");
    proofEnvs = collectEnvironments("proof", "proof");

    renderEnvironmentsAsFieldset(lemmaEnvs, "Lemma", "fs-green", true);
    renderEnvironmentsAsFieldset(theoremEnvs, "Theorem", "fs-green", true);
    renderEnvironmentsAsFieldset(definitionEnvs, "Definition", "fs-green", true);
    renderEnvironmentsAsFieldset(proofEnvs, "Proof", "fs-purple", false);

    // renderEnvironmentsInLaTeXStyle(lemmaEnvs, "Lemma", true);
    // renderEnvironmentsInLaTeXStyle(theoremEnvs, "Theorem", true);
    // renderEnvironmentsInLaTeXStyle(definitionEnvs, "Definition", true);

    // renderEnvironmentsInLaTeXStyle(proofEnvs, "Proof", false);
    // renderProofInLaTeXStyle(proofEnvs, true);

    figures = collectFigures();
    processFigures(figures);

    refTargetContainer = new ReferenceTargetContainer();
    refTargetContainer.addTargetType("lem");
    refTargetContainer.addTargetType("thm");
    refTargetContainer.addTargetType("def");
    refTargetContainer.addTargetType("proof");
    refTargetContainer.addTargetType("fig");

    addEnvironmentsToReferenceContainer(refTargetContainer, lemmaEnvs, "lem", "Lemma");
    addEnvironmentsToReferenceContainer(refTargetContainer, theoremEnvs, "thm", "Theorem");
    addEnvironmentsToReferenceContainer(refTargetContainer, definitionEnvs, "def", "Definition");
    addEnvironmentsToReferenceContainer(refTargetContainer, proofEnvs, "proof", "Proof");
    addFiguresToReferenceContainer(refTargetContainer, figures);

    smartRefs = collectSmartReferences();
    renderSmartRefs(smartRefs, refTargetContainer);



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
        return "<div class=\"display-math-div\">$$" + content + "$$</div>"
    });

    $("inline-math").replaceWith(function(i, content) {
        return "\\(" + content + "\\)"
    });


});

