/**
 * Contains information about a table.
 */
class TableInfo {
    constructor(tabDomObj, caption, tabNumber, tabId) {
        this._tabDomObj = tabDomObj;
        this._caption = caption;
        this._tabNumber = tabNumber;
        this._tabId = tabId;
    }

    /**
     * Retrieve the table HTML object.
     */
    get tableDomObj() {
        return this._tabDomObj;
    }

    /**
     * Retrieve the human-readable caption of the table.
     */
    get caption() {
        return this._caption;
    }

    /**
     * Retrieve the unique and sequential table number.
     */
    get tabNumber() {
        return this._tabNumber;
    }

    /**
     * Retrieve the optional user-specified table identifier.
     */
    get tabId() {
        return this._tabId;
    }
}


/**
 * Collect information about all the tables in the document.
 * 
 * If the table element contains a "tabId" attribute, this will be stored. 
 * The prefix "tab_" will be added to the identifier, in order to group figures in their
 * own namespace.
 */
function collectTables() {
    tables = [];
    $("smartTable").each(function (i) {
        // 'i' is zero indexed.
        const tableNumber = i + 1;

        // retrieve the table caption encoded in the <tableCaption> tag.
        let tableCaption = null;
        if($(this).has("tableCaption").length) {
            var tableCaptionElem = $(this).find("tableCaption");

            // Note: needs to be ".html()", otherwise it does not render properly.
            tableCaption = tableCaptionElem.html();
        }

        // if present, retrieve the "tabId" attribute of the <smart-table> element.
        let tableId = null;
        if(this.hasAttribute("tabId")) {
            tableId = "tab_" + $(this).attr("tabId");
        }

        tables.push(new TableInfo(this, tableCaption, tableNumber, tableId));
    });

    return tables;
}

/**
 * This will remove all <table-caption> elements from the HTML document.
 * 
 * This needs to be done after all tables are collected, since the table captions
 * will be rendered by adding a separate <div> for them, outside the table.
 */
function removeTableCaptionTags() {
    $("tableCaption").each(function(i) {
        $(this).remove();
    })
}


/**
 * This does the following for each "smart-table" element:
 *  - Add the table number to the captions of the tables. 
 *  - Move the caption from inside the table to outside the table.
 *  - Wrap a div around each table.
 * 
 * In case of duplicate table identifiers, a warning will be added below the table.
 */
function processTables(tables) {
    // remove all table captions, since they will be rendered using a <div> instead
    removeTableCaptionTags(tables);
    var seenTableIds = new Set();
    for (tab of tables) {
        // add a div with class="smart-table-div" around the table
        $(tab.tableDomObj).wrap('<div class="smart-table-div"></div>');

        // Add a warning after the table to indicate duplicate table identifiers
        if(tab.tabId != null && seenTableIds.has(tab.tabId)){
            let warningParagraphCode = "<p style=\"text-align: left;\"><span style=\"color: red; background: yellow;\"><strong>ERROR: DUPLICATE TABLE ID '" + fig.figId + "'.</strong></span></p>";
            tab.tableDomObj.insertAdjacentHTML('beforeend', warningParagraphCode);
        } else {
            seenTableIds.add(tab.tabId);
        }

        // if a table identifier is specified, an "id" attribute is added to the table element.
        if(tab.tabId != null) {
            $(tab.tableDomObj).attr("id", tab.tabId);
        }

        // add a div with class="table-caption" that contains the caption
        if(tab.caption != null) {
            let captionCode = "<div class=\"table-caption\">" + "Table " + tab.tabNumber + " \u2013 " + tab.caption + "</div>";
            // tab.tableDomObj.insertAdjacentHTML('beforeend', captionCode);
            $(tab.tableDomObj).after(captionCode);
        }

        // create new <table> element
        const newTable = $("<table id=\"" + tab.tabId + "\"></table>"); // TODO: id="..."

        // retrieve the <table> component of the smart table
        const tableElement = $(tab.tableDomObj).find("table");

        // move children of the table to the new table
        newTable.append($(tableElement).contents());

        // replace <smartTable> with <table>
        $(tab.tableDomObj).replaceWith(newTable);
    }
}


$(document).ready(function () {
    console.log("Loading smart tables...");
    tables = collectTables();
    processTables(tables);
    console.log("Loaded smart tables.");
});




