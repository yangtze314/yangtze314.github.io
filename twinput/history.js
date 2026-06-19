class History {
    constructor(textarea) {
        this.index = -1;
        this.textarea = textarea;
        this.value = [];
        this.selectionStart = [];
        this.selectionEnd = [];
        this.selectionDirection = [];
        this.log();
    }

    log() {
        if (this.index < this.value.length - 1) {
            this.value.length = this.index + 1;
            this.selectionStart.length = this.index + 1;
            this.selectionEnd.length = this.index + 1;
            this.selectionDirection.length = this.index + 1;
        }
        this.index++;
        this.value.push(this.textarea.value);
        this.selectionStart.push(this.textarea.selectionStart);
        this.selectionEnd.push(this.textarea.selectionEnd);
        this.selectionDirection.push(this.textarea.selectionDirection);
    }

    deleteLast() {
        if (this.index - 1 < 0) return;
        this.index--;
        this.value.length--;
        this.selectionStart.length--;
        this.selectionEnd.length--;
        this.selectionDirection.length--;
    }

    undo() {
        if (this.index - 1 < 0) return;
        this.index--;
        this.applyHistory();
    }

    redo() {
        if (this.index + 1 >= this.value.length) return;
        this.index++;
        this.applyHistory();
    }

    applyHistory() {
        this.textarea.value = this.value[this.index];
        this.textarea.setSelectionRange(this.selectionStart[this.index],
                                        this.selectionEnd[this.index],
                                        this.selectionDirection[this.index]);
    }
}
