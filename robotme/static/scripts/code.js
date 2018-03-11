
let minLines = 30;
let startingValue = "";
for (let i = 0; i < minLines; i++) {
    startingValue += '\n';
}
let textArea = document.getElementById('codemirror');
let editor = CodeMirror.fromTextArea(textArea,{
    lineNumbers:true,
    autoClearEmptyLines: true,
    theme: "tomorrow-night-bright",
});
editor.setValue(startingValue);