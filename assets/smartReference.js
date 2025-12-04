
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
 * Add the tables to the reference target container. For each table a ReferenceTarget object
 * will be constructed.
 */
function addTablesToReferenceContainer(container, tables) {
    for (tab of tables) {
        if(tab.tabId == null) {
            continue;
        }
        let refTarget = new ReferenceTarget("Table", tab.tabNumber, null);
        container.addRefTarget("tab", tab.tabId, refTarget);
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


$(document).ready(function () {
    console.log("Loading smart references...");
    refTargetContainer = new ReferenceTargetContainer();
    refTargetContainer.addTargetType("lem");
    refTargetContainer.addTargetType("thm");
    refTargetContainer.addTargetType("def");
    refTargetContainer.addTargetType("proof");
    refTargetContainer.addTargetType("fig");
    refTargetContainer.addTargetType("tab");
    refTargetContainer.addTargetType("ex");

    // NOTE: the variables "lemmaEnvs", "figures", etc. are created when the other javascript files are ran
    addEnvironmentsToReferenceContainer(refTargetContainer, lemmaEnvs, "lem", "Lemma");
    addEnvironmentsToReferenceContainer(refTargetContainer, theoremEnvs, "thm", "Theorem");
    addEnvironmentsToReferenceContainer(refTargetContainer, definitionEnvs, "def", "Definition");
    addEnvironmentsToReferenceContainer(refTargetContainer, proofEnvs, "proof", "Proof");
    addEnvironmentsToReferenceContainer(refTargetContainer, exampleEnvs, "ex", "Example");
    addFiguresToReferenceContainer(refTargetContainer, figures);
    addTablesToReferenceContainer(refTargetContainer, tables);

    smartRefs = collectSmartReferences();
    renderSmartRefs(smartRefs, refTargetContainer);
    console.log("Loaded smart references.");
});
