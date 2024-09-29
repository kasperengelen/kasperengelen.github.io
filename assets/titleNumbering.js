
/**
 * Class that represents a title (e.g., h2, h3 element, ...). It keeps
 * track of the string contents of the title, as well as sub-titles.
 * 
 * Example a h2-title "Introduction" with two h3-subtitles "Motivation", and "Related work".
 */
class Title {
    /**
     * Constructor.
     * - jQueryObj: the jQueryObject that represents the title element.
     * - titleContents: string that contains the title.
     */
    constructor(jQueryObj, titleContents) {
        this._jQueryObj = jQueryObj;
        this._titleContents = titleContents;

        this._subTitles = [];
    }

    get jQueryObj() {
        return this._jQueryObj;
    }

    get titleContents() {
        return this._titleContents;
    }

    get subTitles() {
        return this._subTitles;
    }

    addSubTitle(subTitle) {
        this._subTitles.push(subTitle);
    }
}


function retrieveTitles() {
    // we keep track of each top level title. In practice, these are the h2 titles.
    var topLevelTitles = [];

    // we map every h2 element onto a Title object, which will later also contain the sub-titles
    //  this Map data structure will allow us to retrieve the h2 titles, when processing the h3 titles.
    var h2Map = new Map();
    $("h2").each(function(i) {
        var titleContents = $(this).text();
        var titleObj = new Title($(this), titleContents);

        // NOTE: we use the DOM object as key, and not the jQuery object. This is because
        //  the jQuery object might different based on the context, while the DOM object will
        //  remain the same. The jQuery object will have the DOM object as one of its properties.
        h2Map.set(this, titleObj);
        topLevelTitles.push(titleObj);
    });

    // repeat the same procedure for the h3 titles
    var h3Map = new Map();
    $("h3").each(function(i) {
        // retrieve the parent h2 HTML element
        var prevH2DomObj = $(this).prevAll("h2").first()[0];
        var h2TitleObj = h2Map.get(prevH2DomObj); // retrieve h2 title object

        // create title object
        var titleContents = $(this).text();
        var titleObj = new Title($(this), titleContents);

        // store title object in the h3 datastructure, and also in the h2 title that is the parent of this title
        h3Map.set(this, titleObj); // add h3 to the h3 datastructure
        h2TitleObj.addSubTitle(titleObj); // add h3 title as a subtitle of the h2 title
    });

    // repeat the same procedure for the h3 titles
    var h4Map = new Map();
    $("h4").each(function(i) {
        // retrieve the parent h3 HTML element
        var prevH3DomObj = $(this).prevAll("h3").first()[0];
        var h3TitleObj = h3Map.get(prevH3DomObj); // retrieve h2 title object

        // create title object
        var titleContents = $(this).text();
        var titleObj = new Title($(this), titleContents);

        // store title object in the h4 data structure, and also in the h3 title that is the parent of this title
        h4Map.set(this, titleObj); // add h4 to the h4 data structure
        h3TitleObj.addSubTitle(titleObj); // add h4 title as a subtitle of the h3 title
    });

    return topLevelTitles;
}

function addNumberToTitles(titles, parentTitlePrefix) {

    for (const [index, title] of titles.entries()) { 
        // compute new prefix and title string
        let titlePrefix = parentTitlePrefix + (index+1) + ".";
        let newTitleContents = titlePrefix + " " + title.titleContents;

        // retrieve information from jQuery
        let jQueryObj = title.jQueryObj;
        let htmlTitleTag = jQueryObj.prop("tagName");
        let idAttr = htmlTitleTag + "_" + jQueryObj.attr("id");

        // replace title
        jQueryObj.replaceWith("<" + htmlTitleTag + " id=\"" + idAttr + "\"><a style=\"color: black;\" href=\"#" + idAttr + "\">" + newTitleContents + "</a></" + htmlTitleTag + ">");
        
        // continue with subtitles.
        addNumberToTitles(title.subTitles, titlePrefix);
    }
}


function renderTableOfContents(titles, parentTitlePrefix) {

    var tocHtmlCode = "<ul>\n";

    for (const [index, title] of titles.entries()) { 
        // compute new prefix and title string
        let titlePrefix = parentTitlePrefix + (index+1) + ".";
        let newTitleContents = titlePrefix + " " + title.titleContents;

        // retrieve information from jQuery
        let jQueryObj = title.jQueryObj;
        let htmlTitleTag = jQueryObj.prop("tagName");
        let idAttr = htmlTitleTag + "_" + jQueryObj.attr("id");

        let tocEntry = "<a href=\"#" + idAttr + "\">" + newTitleContents + "</a>";
        tocHtmlCode += "<li>" + tocEntry; // + "</li>\n";

        // continue with subtitles.
        if(title.subTitles.length > 0) {
            tocHtmlCode += "\n"; // looks cleaner
            let subtitleHtml = renderTableOfContents(title.subTitles, titlePrefix);
            tocHtmlCode += subtitleHtml;
        }

        tocHtmlCode += "</li>\n"
    }

    tocHtmlCode += "</ul>\n";

    return tocHtmlCode;
}


$(document).ready(function () {

    // opt-in for title numbering
    if (typeof enableTitleNumbering !== 'undefined') {
        if (enableTitleNumbering) {
            var h2Titles = retrieveTitles();
            addNumberToTitles(h2Titles, "");
            let tocHtml = renderTableOfContents(h2Titles, "");
            console.log(tocHtml);

            $("tableOfContents").replaceWith(function(i, content) {
                return tocHtml;
            });
        }
    }

});

