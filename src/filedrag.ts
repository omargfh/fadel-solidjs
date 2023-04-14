// @ts-nocheck
// https://stackoverflow.com/a/32044172/13363507
export default function isDragSourceExternalFile(dataTransfer){
    // Source detection for Safari v5.1.7 on Windows.
    if (typeof Clipboard != 'undefined') {
        if (dataTransfer.constructor == Clipboard) {
            if (dataTransfer.files.length > 0)
                return true;
            else
                return false;
        }
    }

    // Source detection for Firefox on Windows.
    if (typeof DOMStringList != 'undefined'){
        var DragDataType = dataTransfer.types;
        if (DragDataType.constructor == DOMStringList){
            if (DragDataType.contains('Files'))
                return true;
            else
                return false;
        }
    }

    // Source detection for Chrome on Windows.
    if (typeof Array != 'undefined'){
        var DragDataType = dataTransfer.types;
        if (DragDataType.constructor == Array){
            if (DragDataType.indexOf('Files') != -1)
                return true;
            else
                return false;
        }
    }
}