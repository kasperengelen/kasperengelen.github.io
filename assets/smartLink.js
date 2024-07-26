
/**
 * Class that maps identifiers to urls.
 */
class UrlContainer {
    constructor() {
        this.urls = new Object();
        this.duplicateUrls = new Set();
    }

    /**
     * This will add a URL with the specified identifier.
     * 
     * Parameters:
     *  - identifier: string
     *  - url: string
     */
    addUrl(identifier, url) {
        if(this.hasUrl(identifier)) {
            console.error("Error when adding URL: URL with id '" + identifier + "' already exists.");
            this.duplicateUrls.add(identifier);
            return;
        }

        this.urls[identifier] = url;
    }

    /**
     * Returns true if a URl with the specified identifier exists.
     * 
     * Parameters:
     *  - identifier: string
     */
    hasUrl(identifier) {
        return (identifier in this.urls);
    }

    /**
     * Retrieve the URL with the specified identifier.
     * 
     * Parameters:
     *  - identifier: string
     */
    getUrl(identifier) {
        return this.urls[identifier];
    }

    /**
     * Return the identifiers for which "addUrl" has been called more than
     * once.
     */
    getDuplicateUrls() {
        return this.duplicateUrls;
    }
}

/**
 * Represents a smart link.
 */
class SmartLink {
    /**
     * Parameters:
     *  - domObj: HTML object
     *  - identifier: string
     *  - linkType: string ("ext" or "int")
     *  - label: string
     */
    constructor(domObj, identifier, linkType, label) {
        this._domObj = domObj;
        this._identifier = identifier;
        this._linkType = linkType;
        this._label = label;
    }

    /**
     * Retrieve the HTML object associated with the "smart-link" tag.
     */
    get domObj() {
        return this._domObj;
    }

    /**
     * Retrieve the identifier.
     */
    get identifier() {
        return this._identifier;
    }

    /**
     * Retrieve the link type.
     */
    get linkType() {
        return this._linkType;
    }

    /**
     * Retrieve the link label.
     */
    get label() {
        return this._label;
    }
}

/**
 * Collect all "smart-link" tags.
 */
function collectSmartLinks() {
    var smartLinks = [];
    $("smart-link").each(function(i) {
        let linkIdAttr = $(this).attr("linkId");
        let linkTypeAttr = $(this).attr("linkType");
        let label = $(this).text();
        smartLinks.push(new SmartLink(this, linkIdAttr, linkTypeAttr, label));
    });

    return smartLinks;
}

/**
 * Render the specified list of smart links.
 * 
 * Each link will be rendered as "<a href="URL">LABEL</a>".
 */
function renderSmartLinks(smartLinks, internalUrls, externalUrls) {
    for(smartLink of smartLinks) {
        let identifier = smartLink.identifier;
        let linkType = smartLink.linkType;
        let label = smartLink.label;

        // link type must be internal or external
        if(linkType != "int" && linkType != "ext") {
            $(smartLink.domObj).replaceWith(function(i, content) {
                return "<span style=\"color: red; background: yellow;\"><strong>ERROR: INVALID LINK TYPE '" + linkType + "'!</strong></span>";
            });
            continue;     
        }

        // check if the needed url container is present.
        if(linkType == "int" && internalUrls == null) {
            $(smartLink.domObj).replaceWith(function(i, content) {
                return "<span style=\"color: red; background: yellow;\"><strong>ERROR: NO INTERNAL URLS LOADED!</strong></span>";
            });
            continue;   
        } else if (linkType == "ext" && externalUrls == null) {
            $(smartLink.domObj).replaceWith(function(i, content) {
                return "<span style=\"color: red; background: yellow;\"><strong>ERROR: NO EXTERNAL URLS LOADED!</strong></span>";
            });
            continue;   
        }

        // select the appropriate url container.
        var urlContainer = null;
        if(linkType == "int") {
            urlContainer = internalUrls;
        } else {
            urlContainer = externalUrls;
        }

        if(identifier == "" || identifier == null) {
            $(smartLink.domObj).replaceWith(function(i, content) {
                return "<span style=\"color: red; background: yellow;\"><strong>ERROR: NO IDENTIFIER SPECIFIED!</strong></span>";
            });
        }

        if(label == "") {
            $(smartLink.domObj).replaceWith(function(i, content) {
                return "<span style=\"color: red; background: yellow;\"><strong>ERROR: NO LABEL SPECIFIED!</strong></span>";
            });
        }

        // render the hyper link
        if(urlContainer.hasUrl(identifier)) {
            // replace with <a href="URL">LABEL</a>
            var targetStr = "";
            if(linkType == "ext") {
                targetStr = "target=\"_blank\"";
            }
            $(smartLink.domObj).replaceWith(function(i, content) {
                return "<a href=\"" + urlContainer.getUrl(identifier) + "\"" + targetStr + ">" + label + "</a>";
            });
        } else {
            $(smartLink.domObj).replaceWith(function(i, content) {
                return "<span style=\"color: red; background: yellow;\"><strong>ERROR: NO URL EXISTS FOR TYPE '" + linkType + "' and ID '" + identifier + "'!</strong></span>";
            });
        }
    }
}


$(document).ready(function () {

    // the internal and external url containers are optional and might not be present
    intUrls = typeof(intUrls) == 'undefined' ? null : intUrls;
    extUrls = typeof(extUrls) == 'undefined' ? null : extUrls;

    // collect all smart-link tags
    let smartLinks = collectSmartLinks();

    // render all smart links
    renderSmartLinks(smartLinks, intUrls, extUrls);
});
