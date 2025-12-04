
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
    console.log("Loading smart figures...");
    figures = collectFigures();
    processFigures(figures);
    console.log("Loaded smart figures.");
});
