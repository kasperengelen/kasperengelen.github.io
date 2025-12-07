


/**
 * Represents a list of authors.
 */
class AuthorList {
    /**
     * Parameters:
     *  - authors: list of string
     */
    constructor(authors) {
        this.authors = authors;
    }

    /**
     * Authors will be summed up using "Oxford style" commas.
     */
    toString() {
        if(this.authors.length == 1) {
            return this.authors[0];
        } else {
            // let arr = this.authors.slice() // copy
            let authors = this.authors.slice();

            // https://stackoverflow.com/questions/23483718/turn-array-into-comma-separated-grammatically-correct-sentence
            var last = authors.pop();
            return authors.join(', ') + ' and ' + last;
        }
    }
}


/**
 * Contains information about an entry in the bibliography.
 */
class BibEntry {

    /**
     * Parameters:
     *  - identifier: string
     */
    constructor(identifier) {
        this._identifier = identifier;
    }

    /**
     * Return the identifier of the entry.
     */
    get identifier() {
        return this._identifier;
    }

    /**
     * Render the bibliography entry as a string.
     * 
     * The string will contain the necessary HTML code for typesetting, but
     * does not yet contain any enveloping tags such as <p> or <div>.
     */
    render() {}
}


/**
 * A bibliography entry that refers to a book.
 */
class BookEntry extends BibEntry {
    /**
     * Parameters:
     *  - identifier: string
     *  - authors: AuthorList object
     *  - title: string
     *  - publisher: string (optional)
     *  - year: int (optional)
     */
    constructor(identifier, authors, title, publisher, year) {
        super(identifier);
        this.authors = authors;
        this.title = title;
        this.publisher = publisher;
        this.year = year;
    }

    /**
     * Retrieve a formatted representation of the publisher and year.
     * This will take into account that publisher and year can each be optional.
     */
    _getPublishingInfo() {
        if(this.publisher == null && this.year == null) {
            return "";
        } else if (this.publisher == null) {
            return this.year + ".";
        } else if (this.year == null) {
            return "<i>" + this.publisher + "</i>.";
        } else {
            return "<i>" + this.publisher + "</i>. " + this.year + ".";
        }
    }

    /**
     * This will be formatted as:
     *  [Book] <strong>TITLE</strong><br>
     *  Author 1, ..., and Author n. <i>PUBLISHER</i>, YEAR.
     */
    render() {
        var retval = "";

        retval += "[Book] <strong>" + this.title + "</strong><br>";
        retval += this.authors.toString() + ". " + this._getPublishingInfo();

        return retval;
    }
}


/**
 * A bibliography entry that refers to a website.
 */
class WebsiteEntry extends BibEntry {
    /**
     * Parameters:
     * - authors: AuthorList object
     * - title: string
     * - url: string
     * - retrievalDate: Date object (optional)
     */
    constructor(identifier, authors, title, url, retrievalDate) {
        super(identifier);
        this.authors = authors;
        this.title = title;
        this.url = url;
        this.retrievalDate = retrievalDate;
    }

    /**
     * This will be formatted as:
     *  [Website] <strong>TITLE</strong><br>
     *  Author 1, ..., and Author n. URL: <a href="URL" target="_blank">URL</a>.
     *  Accessed: DATE. 
     */
    render() {
        var retval = "";
        retval += "[Website] <strong>" + this.title + "</strong><br>";

        if(this.authors != null) {
            retval += this.authors.toString() + ". URL: <a href=\"" + this.url + "\" target=\"_blank\">" + this.url + "</a>.<br>";
        }

        if(this.retrievalDate != null) {
            // <day (int)> <month (name, capitalised)> <year>
            let day = this.retrievalDate.getDate();
            let year = this.retrievalDate.getFullYear();
            let month = this.retrievalDate.toLocaleString('default', { month: 'long' });

            retval += "Accessed: " + day + " " + month + " " + year + ".<br>";
        }

        return retval;
    }
}


/**
 * A bibliography entry that refers to a conference article.
 */
class ConferenceArticleEntry extends BibEntry {
    /**
     * Parameters:
     *  - authors: AuthorList object.
     *  - title: string
     *  - conference: string
     *  - year: int
     */
    constructor(identifier, authors, title, conference, year) {
        super(identifier);
        this.authors = authors;
        this.title = title;
        this.conference = conference;
        this.year = year;
    }

    /**
     * This will be formatted as:
     *  [Conference] <strong>TITLE</strong><br>
     *  Author 1, ..., and Author n. <i>CONFERENCE</i>, YEAR.
     */
    render() {
        var retval = "";
        retval += "[Conference] <strong>" + this.title + "</strong><br>";
        retval += this.authors.toString() + ". <i>" + this.conference + "</i>. " + this.year + ".<br>";

        return retval;
    }
}

/**
 * A bibliography entry that refers to a journal article.
 */
class JournalArticleEntry extends BibEntry {
    /**
     * Parameters:
     *  - authors: AuthorList object.
     *  - title: string
     *  - journal: string
     *  - year: int
     */
    constructor(identifier, authors, title, journal, year) {
        super(identifier);
        this.authors = authors;
        this.title = title;
        this.journal = journal;
        this.year = year;
    }

    /**
     * This will be formatted as:
     *  [Journal] <strong>TITLE</strong><br>
     *  Author 1, ..., and Author n. <i>JOURNAL</i>, YEAR.
     */
    render() {
        var retval = "";
        retval += "[Journal] <strong>" + this.title + "</strong><br>";
        retval += this.authors.toString() + ". <i>" + this.journal + "</i>. " + this.year + ".<br>";

        return retval;
    }
}

/**
 * Class that contains a bibliography.
 */
class Bibliography {
    constructor() {
        // maps entry identifiers (string) to the entry (BibEntry object)
        this.bibEntries = new Object();

        // these are used to keep track of which bib entries are referenced while processing the smart citations
        this.referencedEntryIds = new Set(); // used to check if an entry is referenced or not
        this.referencedEntryIdsOrdered = []; // used to track the order in which sources are referenced

        // keeps track of identifiers for which the "addBibEntry" method has been called more than once
        this.duplicateEntryIds = new Set();
    }

    /**
     * Add an entry to the bibliography with the specified identifier.
     * 
     * Parameters:
     * - entry: BibEntry object
     */
    addBibEntry(entry) {
        if(this.hasBibEntry(entry.identifier)) {
            console.error("Error when adding bib entry: bib entry with id '" + entry.identifier + "' already exists.");
            this.duplicateEntryIds.add(entry.identifier);
            return;
        }

        this.bibEntries[entry.identifier] = entry;
    }

    /**
     * Determine whether the bibliography contains an entry with the specified
     * identifier.
     * 
     * Parameters:
     * - identifier: string
     */
    hasBibEntry(identifier) {
        return (identifier in this.bibEntries);
    }

    /**
     * Retrieve the bibliography entry with the specified identifier.
     */
    getBibEntry(identifier) {
        return this.bibEntries[identifier];
    }

    /**
     * Retrieve the identifiers for which "addBibEntry" has been called multiple times.
     */ 
    getDuplicateEntryIds() {
        return this.duplicateEntryIds;
    }

    /**
     * Retrieve all bibliography entries.
     */
    getAllBibEntries() {
        var retval = [];

        for(let key in this.bibEntries) {
            retval.push(this.bibEntries[key]);
        }

        return retval;
    }

    /**
     * Mark the bibliography entry as referenced.
     */
    markBibEntryAsReferenced(identifier) {
        if(!this.referencedEntryIds.has(identifier)) {
            this.referencedEntryIds.add(identifier);
            this.referencedEntryIdsOrdered.push(identifier);
        }
    }

    /**
     * Retrieve all bibliography entries that have been referenced, in the order
     * that they were referenced.
     */
    getAllReferencedBibEntriesInOrder() {
        var retval = [];

        for(let identifier of this.referencedEntryIdsOrdered) {
            retval.push(this.bibEntries[identifier]);
        }

        return retval;
    }

    /**
     * Get the sequential user-friendly of the identifier.
     * 
     * This is the order in which the source with the identifier was referenced.
     */
    getReferenceNumberForIdentifier(identifier) {
        return this.referencedEntryIdsOrdered.indexOf(identifier) + 1;
    }


}


/**
 * Represents a smart citation.
 */
class SmartCite {
    /**
     * Parameters:
     * - domObj: the HTML object of the quick ref tag.
     * - bibId: string
     * - extraText: string or null
     */
    constructor(domObj, bibId, extraText) {
        this._domObj = domObj;
        this._bibId = bibId;
        this._extraText = extraText;
    }

    /**
     * The HTML object that represents the smart citation.
     */
    get domObj() {
        return this._domObj;
    }

    /**
     * The identifier of the referenced bibliography entry.
     */
    get bibId() {
        return this._bibId;
    }

    /**
     * Optional extra text associated with the citation.
     */
    get extraText() {
        return this._extraText;
    }
}


/**
 * Collect all "smart-cite" tags.
 */
function collectSmartCites() {
    var smartCites = [];
    $("smart-cite").each(function(i) {
        let bibIdAttr = $(this).attr("bibId");

        // get text in between tags
        let extraText = $(this).text();
        if (!extraText) {
            extraText = null;
        }

        smartCites.push(new SmartCite(this, bibIdAttr, extraText));
    });

    return smartCites;
}


/**
 * Process all the smart cites. The bibliography will be modified
 * in order to mark the bib entries as referenced.
 */
function processSmartCites(smartCites, bibliography) {
    for(smartCite of smartCites) {
        let identifier = smartCite.bibId;

        if(bibliography.hasBibEntry(identifier)) {
            bibliography.markBibEntryAsReferenced(identifier);    
        } else {
            console.error("Error when processing smart cite: bib entry with id '" + identifier + "' does not exist.");
        }
    }
}


/**
 * Render the specified list of smart cites.
 */
function renderSmartCites(smartCites, bibliography) {
    for(smartCite of smartCites) {
        let identifier = smartCite.bibId;

        if(bibliography.hasBibEntry(identifier)) {
            let citeLabel = "[";
            citeLabel += bibliography.getReferenceNumberForIdentifier(identifier);

            // only add a comma and extra text if the string is not empty
            if (smartCite.extraText) {
                citeLabel += ", " + smartCite.extraText;
            }

            citeLabel += "]";

            // replace with <a href="#...">[NR, Optional Text]</a>
            $(smartCite.domObj).replaceWith(function(i, content) {
                return "<strong><a href=\"#bibEntry_" + identifier + "\">" + citeLabel + "</a></strong>";
            });
        } else {
            $(smartCite.domObj).replaceWith(function(i, content) {
                return "<span style=\"color: red; background: yellow;\"><strong>ERROR: NO BIB ENTRY EXISTS FOR ID '" + smartCite.bibId + "'.</strong></span>";
            });
        }
    }
}


/**
 * Replace each <bibliography> tag with an ordered list of bibliography entries.
 */
function renderBibliography(bibliography) {
    $("bibliography").each(function(i) {
        var bibContent = "";

        // print warning message in case duplicate ids were present.
        let duplicateIds = bibliography.getDuplicateEntryIds();
        if(duplicateIds.size > 0) {
            var errorMsg = "<div style=\"color: red; background: yellow;\">";
            errorMsg += "<p><strong>ERROR: duplicate bibliography entry identifiers detected:\n<ul>";
            for(duplicateId of duplicateIds) {
                errorMsg += "<li>\"" + duplicateId + "\"</li>\n"
            }
            errorMsg += "</ul></strong></p></div>";
            bibContent += errorMsg;
        }

        bibContent += "<div id=\"bibliography_list\" class=\"bibList\"><ol>";
        // NOTE: the numbering is done automatically using CSS. The bib entries are expected 
        //  to occur in the "bibEntries" list in the correct order.
        for(bibEntry of bibliography.getAllReferencedBibEntriesInOrder()) {
            var bibEntryId = bibEntry.identifier
            var entryContent = "<p id=\"bibEntry_" + bibEntryId + "\">" + bibEntry.render() + "</p>";
            bibContent += "<li>" + entryContent + "</li>";
        }

        bibContent += "</ol></div>";


        $(this).replaceWith(bibContent);
    });
}


$(document).ready(function () {

    if (typeof bib !== 'undefined') {
        console.log("Loading smart citations...");

        // collect all smart-cite tags
        var smartCites = collectSmartCites();


        // mark the encountered bib entries as "referenced"
        // and determine the order of the bibliography entries
        processSmartCites(smartCites, bib);

        // render the quick cites with the correct link and identifier number,
        // and mark all non-existing bib entries as not found, with a warning.
        renderSmartCites(smartCites, bib);

        // render the bibliograpy
        renderBibliography(bib);
        console.log("Loaded smart citations.");
    }
});

