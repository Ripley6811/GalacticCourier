function addDocumentListeners() {

    var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";

    document.addEventListener(
        "keydown", 
        handleKeyDown,
        true
    );
    document.addEventListener(
        "keyup", 
        handleKeyUp,
        true
    );
    document.addEventListener(
        mousewheelevt, 
        handleWheel, 
        false
    );


};