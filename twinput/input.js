const test = document.getElementById("test");
const editor = document.getElementById("editor");
const history = new History(editor);

let keyMap = KEYMAP_NORMAL;  // Current key mapping

let key = "";
let alt, ctrl, shift = false;

editor.addEventListener("keydown", (event) => {
    key = event.key;
    alt = event.altKey;
    ctrl = event.ctrlKey;
    shift = event.shiftKey;

    if (ctrl) {
        switch (key) {
            case "z":
                event.preventDefault();
                history.undo();
                break;
            case "y":
                event.preventDefault();
                history.redo();
                break;
            default: break;
        }
        return;
    }

    if (alt) {
        if (!SPECIAL_KEYS.includes(key)) {
            event.preventDefault();
            tryMappings(0, keyMap["ALT"], keyMap, KEYMAP_NORMAL);
            history.log();
        }
    }

    // switch (key) {
    //     case "F1":
    //         keyMap = KEYMAP_NORMAL;
    //         event.preventDefault();
    //         break;
    //     case "F2":
    //         toggleMapping(KEYMAP_GREEK);
    //         event.preventDefault();
    //         break;
    //     case "F3":
    //         toggleMapping(KEYMAP_SYMBOLS);
    //         event.preventDefault();
    //         break;
    //     case "F4":
    //         toggleMapping(KEYMAP_SUPERSCRIPT);
    //         event.preventDefault();
    //         break;
    //     case "F5":
    //         toggleMapping(KEYMAP_SUBSCRIPT);
    //         event.preventDefault();
    //         break;
    //     default: ;
    // }

});

function toggleMapping(map) {
    if (keyMap == map) keyMap = KEYMAP_NORMAL;
    else keyMap = map;
}

editor.addEventListener("keyup", (event) => {
    alt = event.altKey;
    ctrl = event.ctrlKey;
    shift = event.shiftKey;
});

editor.addEventListener("beforeinput", () => {
    if (ctrl) {
        if (key == "x" || key == "v") {
            history.deleteLast();
            history.log();
        }
    }
});

editor.addEventListener("input", () => {

    // "beforeinput" -> key mapping, "input" -> autocorrection: "input" doesn't fire when key map activated
    // "beforeinput" -> key mapping, "beforeinput" -> autocorrection: keys that are not mapped haven't appeared
    //                                                                yet, making autocorrection inaccuarate

    // Key mapping

    if (SPECIAL_KEYS.includes(key)) {
        // Ignore Enter, Backspace, Process (for IMEs), etc.
        keyMap = KEYMAP_NORMAL;
        history.log();
        return;
    }

    if (ctrl) {
        if (key == "x" || key == "v") history.log();
        return;  // Ignore Ctrl+C, Ctrl+V, etc.
    }

    tryMappings(1, keyMap, KEYMAP_NORMAL);
    history.log();

    // // Autocorrection

    // let str;
    // // test.innerText = "";  //
    // for (let i = 0; i < AUTOCORRECT.length; i++) {
    //     str = editor.value.slice(editor.selectionEnd - i, editor.selectionEnd);
    //     // test.innerText += "\n" + str;  //
    //     entries = AUTOCORRECT[i];
    //     if (entries[str]) {
    //         autocorrect(i, entries[str]);
    //         history.log();
    //         // test.innerText += "...........Bingo";  //
    //     }
    // }

});

function tryMappings(backspace, ...mappings) {
    let glyph;
    for (let map of mappings) {
        if (map[key]) {
            glyph = map[key];
            break;
        }
    }
    if (glyph) autocorrect(backspace, glyph);

    if (keyMap != KEYMAP_NORMAL) keyMap = KEYMAP_NORMAL;
}

function autocorrect(backspace, str) {
    let pcaret = editor.selectionEnd;
    let pvalue = editor.value;
    let caret = pcaret;

    editor.value = pvalue.slice(0, pcaret - backspace);
    caret -= backspace;

    editor.value += str;
    caret += str.length;
    editor.value += pvalue.slice(pcaret);

    editor.selectionEnd = caret;
}
