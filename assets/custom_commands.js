

/**
 * Replace all occurrences of the "todo-box" tag with a "highlight box".
 * 
 * The specified tag can take an optional attribute "title". If specified, a <h3> element will be inserted with the title.
 */
function handleTodoBox(highLightBoxClass) {
    $("todo-box").each(function(i) {
        if(this.hasAttribute("title")) {
            var titleAttr = $(this).attr("title");
            /* NOTE: this only works properly if we pass a lambda. Otherwise, the MathJAX content is not rendered properly. */
            $(this).replaceWith(function(i, content) { return "<div class=\"" + highLightBoxClass + "\"><h3>" + titleAttr + "</h3>\nTODO: " + content +  "</div>"});

        } else {
            /* NOTE: this only works properly if we pass a lambda. Otherwise, the MathJAX content is not rendered properly. */
            $(this).replaceWith(function(i, content) { return "<div class=\"" + highLightBoxClass + "\">TODO: " + content +  "</div>"});
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


/**
 * Terminal command.
 */
class TerminalCommand {
    constructor(content) {
        this.content = content;
    }
}

/**
 * Terminal response.
 */
class TerminalResponse {
    constructor(content) {
        this.content = content;
    }
}

/**
 * Contains information about the contents of a terminal window.
 */
class TerminalBoxInfo {
    constructor(name, elements, elementRef, isMinimal) {
        this.name = name;
        this.elements = elements; // Array of TerminalCommandInfo
        this.elementRef = elementRef;   // pointer to original <terminalBox> DOM element
        this.isMinimal = isMinimal
    }
}


/**
 * Replace all occurrences of the <terminalBox> tag with the appropriate HTML code.
 * 
 * Input:
 * <terminalBox>
 *      <tTitle>Bash</tTitle>
 *      <tCommand>echo "Hello world!"</tCommand>
 *      <tResponse>Hello world!</tResponse>
 * </terminalBox>
 * 
 * 
 * Output:
 * <div class="terminal">
 *     <div class="term_bar">
 *         <div class="term_controls">
 *         <span class="term_control term_control_btn_red"></span>
 *         <span class="term_control term_control_btn_yellow"></span>
 *         <span class="term_control term_control_btn_green"></span>
 *         </div>
 *         <div class="term_title">bash</div>
 *     </div>
 *   
 *     <div class="term_content">
 *         <div class="term_line term_prompt">$ ls</div>
 *         <div class="term_line term_response">file1.txt  src/  README.md</div>
 *         <div class="term_line term_prompt">$ echo "hello"</div>
 *         <div class="term_line term_response">hello</div>
 *     </div>
 * </div>
 *
 */
function collectTerminalBoxes() {
    let allBoxes = [];
    // handle all <terminalBox> commands
    $("terminalBox").each(function(i) {
        const boxElem = $(this); // jQuery pointer to this <terminalBox>

        // check if the box is "minimal"
        const isMinimal = $(this).attr("data-minimal") !== undefined;

        //  handle <tTitle>
        let terminalName = null;
        const titleElem = $(this).find("tTitle");
        if(titleElem.length) {
            terminalName = titleElem.html(); // use .html() to preserve content
        }


        //  handle <tCommand>
        //  handle <tResponse>
        let commands = [];
        $(this).children().each(function() {
            const tag = this.tagName.toLowerCase();

            if (tag === "tcommand") {
                commands.push(new TerminalCommand($(this).html()));
            } else if (tag === "tresponse") {
                commands.push(new TerminalResponse($(this).html()));
            }
        });

        allBoxes.push(new TerminalBoxInfo(terminalName, commands, boxElem, isMinimal));
    });

    return allBoxes;
}


function handleTerminalBoxes(terminalBoxes) {
    terminalBoxes.forEach(box => {
        // Create terminal container
        const $terminalHTML = $("<div>", { class: "terminal" });

        // Window bar
        if(!box.isMinimal) {
            const $termBar = $("<div>", { class: "term_bar" });
            const $termControls = $("<div>", { class: "term_controls" });
            $termControls.append('<span class="term_control term_control_btn_red"></span>');
            $termControls.append('<span class="term_control term_control_btn_yellow"></span>');
            $termControls.append('<span class="term_control term_control_btn_green"></span>');

            const $termTitle = $("<div>", { class: "term_title", html: box.name || "" });
            $termBar.append($termControls).append($termTitle);
            $terminalHTML.append($termBar)
        }
        

        // Terminal content
        const $termContent = $("<div>", { class: "term_content" });
        box.elements.forEach(el => {
            if (el instanceof TerminalCommand) {
                $termContent.append($("<div>", { class: "term_line term_prompt", html: "$ " + el.content }));
            } else if (el instanceof TerminalResponse) {
                $termContent.append($("<div>", { class: "term_line term_response", html: el.content }));
            }
        });
        $terminalHTML.append($termContent);

        // Replace original <terminalBox> in DOM
        box.elementRef.replaceWith($terminalHTML);
    });
}


$(document).ready(function () {
    /* Custom tags */
    // replaceCustomTagWithHighlightBox("example-box", "highlight-box-gray");
    // replaceCustomTagWithHighlightBox("warning-box", "highlight-box-yellow");

    console.log("Loading todo boxes...")
    handleTodoBox("highlight-box-blue");
    console.log("Loading warning boxes...")
    replaceCustomTagWithFieldset("warning-box", "fs-yellow", "Warning");
    console.log("Loading note boxes...")
    replaceCustomTagWithFieldset("note-box", "fs-blue", "Note");

    // handle styled terminal boxes
    console.log("Loading terminal boxes...")
    terminalBoxes = collectTerminalBoxes();
    handleTerminalBoxes(terminalBoxes);

    console.log("Loading clickable titles...")
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

    console.log("Loading code tags...")
    $("texttt").replaceWith(function(i, content) {
        return "<code>" + content + "</code>"
    });
});
