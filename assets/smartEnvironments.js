
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


$(document).ready(function () {
    lemmaEnvs = collectEnvironments("lemma", "lem");
    theoremEnvs = collectEnvironments("theorem", "thm");
    definitionEnvs = collectEnvironments("definition", "def");
    proofEnvs = collectEnvironments("proof", "proof");
    exampleEnvs = collectEnvironments("example", "example");

    let renderAsFieldset = true;

    if(renderAsFieldset) {
        renderEnvironmentsAsFieldset(lemmaEnvs, "Lemma", "fs-green", true);
        renderEnvironmentsAsFieldset(theoremEnvs, "Theorem", "fs-green", true);
        renderEnvironmentsAsFieldset(definitionEnvs, "Definition", "fs-green", true);
        renderEnvironmentsAsFieldset(proofEnvs, "Proof", "fs-purple", false);
        renderEnvironmentsAsFieldset(exampleEnvs, "Example", "fs-blue", true);
    } else {

        renderEnvironmentsInLaTeXStyle(lemmaEnvs, "Lemma", true);
        renderEnvironmentsInLaTeXStyle(theoremEnvs, "Theorem", true);
        renderEnvironmentsInLaTeXStyle(definitionEnvs, "Definition", true);
        // renderEnvironmentsInLaTeXStyle(proofEnvs, "Proof", false);
        renderProofInLaTeXStyle(proofEnvs, true);

        renderEnvironmentsInLaTeXStyle(exampleEnvs, "Example", true);
    }
});


