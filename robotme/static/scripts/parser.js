const prohibitedWords = ["and", "or", "not", "is",
                        "as", "assert", "break", "class", "continue",
                        "def", "del", "elif", "else", "except", "finally",
                        "for", "from", "global", "if", "import",
                        "lambda", "pass", "raise", "return", "try",
                        "while", "with", "yield", "in","abs", "all", 
                        "any", "bin", "bool", "bytearray", "callable", "chr",
                        "classmethod", "compile", "complex", "delattr", "dict", "dir", "divmod",
                        "enumerate", "eval", "filter", "float", "format", "frozenset",
                        "getattr", "globals", "hasattr", "hash", "help", "hex", "id",
                        "input", "int", "isinstance", "issubclass", "iter", "len",
                        "list", "locals", "map", "max", "memoryview", "min", "next",
                        "object", "oct", "open", "ord", "pow", "property", "range",
                        "repr", "reversed", "round", "set", "setattr", "slice",
                        "sorted", "staticmethod", "str", "sum", "super", "tuple",
                        "type", "vars", "zip", "__import__", "NotImplemented",
                        "Ellipsis", "__debug__"]

const variableRegExp = new RegExp()


const parseAndUpload = () =>{
    let siempreCounter = new Array();
    /*Element object:
    end: 7
    start: 0
    state: {…}
        beginningOfLine: false
        dedent: 0
        indent: 0
        lambda: false
        lastToken: "control"
        scopes: […]
            0: Object { offset: 0, type: "py", align: null }
            length: 1
            __proto__: Array []
        tokenize: tokenBase()
        length: 2
        name: "tokenBase"
        prototype: Object { … }
    __proto__: function ()
    __proto__: Object { … }
    string: "siempre"
    type: "control"
    __proto__: Object { … }*/
    for(let i =0; i < editor.lineCount(); i++){
        tokens = editor.getLineTokens(i)
        tokens.forEach((element, index) => {
            switch(element.type){
                case "comment":{
                    break;
                }
                case "control":{
                    //Control words: ["si","entonces","sino", "siempre"]
                    switch(element.string){
                        case "siempre":{
                            siempreCounter.push(element);
                            break;
                        }
                        case "si":{
                            //Check condition of if
                            
                            break;
                        }
                    }
                    break;
                }
                case "servo":{
                    if (element.string == "girar"){
                        posible_values = ["0","90","180"]
                        if (servo_vars.indexOf(tokens[index+2].string)<0) error("Error: servo variable", i)
                        if (posible_values.indexOf(tokens[index+4].string)<0) error("Error: valor no valido", i)
                        if (tokens[index+6].string!=="grados") error("Error: servo completar codigo", i)
                    }
                break;
                }
                case "ledbuzzer":{
                    if (ledbuzzer_vars.indexOf(tokens[index+2].string)<0) error("Error: ledbuzzer variable", i)
                    break;
                }
                case "motor":{
                    if (motor_vars.indexOf(tokens[index+2].string)<0) error("Error: motor variable", i)
                }
            }
        });
    }
    if(siempreCounter.length!=1){
        console.log("Solo debe haber un solo ciclo siempre")
    }
    if($('.cm-error').length){
        console.log("ERROR")
    }else{
        console.log("NO ERROR")
    }
}

const error = (message, line) =>{
    console.log(message)
    console.log(line)
    let from = {
        line: line-1,
        char: 0,
    }
    let to = {
        line: line,
        char: 0,
    }
    editor.markText(from,to,{
        className:"cm-error",
        clearOnEnter: true,
    })
}