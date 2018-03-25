const check = () => {
    let siempreCounter = new Array();
    for (i = 0; i < editor.lineCount(); i++) {
        tokens = editor.getLineTokens(i)
        tokens.forEach((element, index) => {
            switch (element.type) {
                case "comment":
                    {
                        break;
                    }
                case "control":
                    {
                        //Control words: ["si","entonces","sino", "siempre"]
                        switch (element.string) {
                            case "siempre":
                                {
                                    siempreCounter.push(element);
                                    if (siempreCounter.length >= 2) error("Error: Solo debe haber un siempre", i)
                                    if (element.state.indent !== 0) error("Error: siempre no puede estar indentado", i)
                                    break;
                                }
                            case "si":
                                {
                                    checkIndent(element, i)
                                    let stringsIf = new Array();
                                    for (j = 0; j < tokens.length; j++) {
                                        stringsIf.push(tokens[j].string)
                                    }
                                    if (stringsIf.indexOf(")") < 0) error("Error: Completa los parentesis", i)
                                    if (stringsIf.indexOf("(") < 0) error("Error: Completa los parentesis", i)
                                    if (stringsIf.indexOf("(") > stringsIf.indexOf(")")) error("Error: Completa los parentesis", i)
                                }
                        }
                        break;
                    }
                case "servo":
                    {
                        if (element.string == "girar") {
                            checkIndent(element, i)
                            posible_values = ["0", "90", "180"]
                            if (servo_vars.indexOf(tokens[index + 2].string) < 0) error("Error: servo variable", i)
                            if (posible_values.indexOf(tokens[index + 4].string) < 0) error("Error: valor no valido", i)
                            if (tokens[index + 6].string !== "grados") error("Error: servo completar codigo", i)
                        }
                        break;
                    }
                case "ledbuzzer":
                    {
                        checkIndent(element, i)
                        if (ledbuzzer_vars.indexOf(tokens[index + 2].string) < 0) error("Error: ledbuzzer variable", i)
                        break;
                    }
                case "motor":
                    {
                        checkIndent(element, i)
                        if (motor_vars.indexOf(tokens[index + 2].string) < 0) error("Error: motor variable", i)
                        break
                    }
                case "interruption":
                    {
                        if (element.string === "cuando") {
                            if (interruption_vars.indexOf(tokens[index + 2].string) < 0) error("Error: interrupcion no valida", i)
                            if (tokens[index + 4].string !== "detecte") error("Error: Completacion de codigo", i)
                            if (tokens[index + 6].string !== "alto") error("Error: valor no valido", i)
                            if (tokens[index + 8].string !== "entonces") error("He", i)
                        }
                        break;
                    }
                case "other":
                    {
                        switch (element.string) {
                            case "esperar":
                                {
                                    checkIndent(element, i)
                                    if (tokens[index + 2].type !== "number") error("Error: debe ser un valor numerico", i)
                                    if (parseInt(tokens[index + 2].string) > 60 || parseInt(tokens[index + 2].string) < 0) error("Error: valor entre 0 y 60", i)
                                    if (tokens[index + 4].string !== "segundos") error("Error: debes completar el codigo", i)
                                    break;
                                }
                            case "decir":
                                {
                                    checkIndent(element, i)
                                    let allowed_types = ["string", "number", "variable", "operator"]
                                    //let string_reg_exp = new RegExp(/[']+[a-zA-Z0-9-_",./']+[']/)
                                    let stringsPrint = new Array();
                                    for (j = 0; j < tokens.length; j++) {
                                        stringsPrint.push(tokens[j].string)
                                    }
                                    let start = stringsPrint.indexOf('decir')+2
                                    for ( j = start; j < tokens.length ; j++){
                                        if (allowed_types.indexOf(tokens[j].type) < 0 && tokens[j].type !== null){
                                            console.log(tokens[j])
                                            error("Error: valor de 'decir' no valido" + j, i)
                                        } 
                                    }
                                    break;
                                }
                        }
                    }
                    break;
            }
        });
    }
    if ($('.cm-error').length) {
        console.log("ERROR")
        return true
    } else {
        console.log("NO ERROR")
        return false
    }
}

const error = (message, line) => {
    let from = {
        line: line - 1,
        char: 0,
    }
    let to = {
        line: line,
        char: 0,
    }
    editor.markText(from, to, {
        className: "cm-error",
        clearOnEnter: true,
    })
    console.log(message)
}

const checkIndent = (element, line) => {
    if (element.state.indent <= 0) error("Error: falta indentacion", line)
}

let code

const parseAndUpload = () => {
    let errors = check()
    if (!errors) {
        code = new Array()
        for (let i = 0; i < editor.lineCount(); i++) {
            tokens = editor.getLineTokens(i)
            tokens.forEach((element, index) => {
                switch (element.type) {
                    case "comment":
                        {
                            break;
                        }
                    case "control":
                        {
                            //Control words: ["si","entonces","sino", "siempre"]
                            if (element.string === "siempre") write("while True:", 0)
                            if (element.string === "si") {
                                let stringsIf = new Array();
                                for (j = 0; j < tokens.length; j++) {
                                    stringsIf.push(tokens[j].string)
                                }
                                let start = stringsIf.indexOf("(");
                                let end = stringsIf.indexOf("entonces");
                                let condition = "";
                                for (j = start; j < end - 1; j++) {
                                    switch (stringsIf[j]) {
                                        case "y":
                                            {
                                                condition += "and";
                                                break;
                                            }
                                        case "o":
                                            {
                                                condition += "or";
                                                break;
                                            }
                                        case "no":
                                            {
                                                condition += "not";
                                                break;
                                            }
                                        default:
                                            {
                                                condition += stringsIf[j]
                                                break;
                                            }
                                    }
                                }
                                write(`if ${condition}:`, element.state.indent)
                            }
                            if (element.string === "sino") write("else", element.state.indent)
                        }
                    case "servo":
                        {
                            if (element.string == "girar") {
                                let varName = tokens[index + 2].string;
                                switch (tokens[index + 4].string) {
                                    case "0":
                                        {
                                            write(`pi.set_servo_pmw(${varName},1500)`, element.state.indent)
                                            break;
                                        }
                                    case "90":
                                        {
                                            write(`pi.set_servo_pmw(${varName},2000)`, element.state.indent)
                                            break;
                                        }
                                    case "180":
                                        {
                                            write(`pi.set_servo_pmw(${varName},2500)`, element.state.indent)
                                            break;
                                        }
                                }
                            }
                            break;
                        }
                    case "ledbuzzer":
                        {
                            let varName = tokens[index + 2].string
                            if (element.string === "encender") {
                                write(`pi.write(${varName}, 1)`, element.state.indent)
                            } else {
                                write(`pi.write(${varName}, 0)`, element.state.indent)
                            }
                            break;
                        }
                    case "motor":
                        {
                            let varName = tokens[index + 2].string
                            if (element.string === "mover") {
                                write(`pi.write(${varName}, 1)`, element.state.indent)
                            } else {
                                write(`pi.write(${varName}, 0)`, element.state.indent)
                            }
                            break
                        }
                    case "interruption":
                        {
                            if (element.string === "cuando") {
                                /*if (interruption_vars.indexOf(tokens[index+2].string)<0) error("Error: interrupcion no valida", i)
                                if (tokens[index+4].string!=="detecte") error("Error: Completacion de codigo", i)
                                if (tokens[index+6].string!=="alto") error("Error: valor no valido", i)
                                if (tokens[index+8].string!=="entonces") error("He", i)*/
                            }
                            break;
                        }
                    case "other":
                        {
                            switch (element.string) {
                                case "esperar":
                                    {
                                        write(`sleep(${tokens[index+2].string})`, element.state.indent)
                                        break;
                                    }
                                    case "decir":
                                        {
                                            printArg = "";
                                            let stringsPrint = new Array();
                                            for (j = 0; j < tokens.length; j++) {
                                                stringsPrint.push(tokens[j].string)
                                            }
                                            let start = stringsPrint.indexOf('decir') + 2
                                            for (j = start; j < tokens.length; j++) {
                                                printArg += stringsPrint[j]
                                            }
                                            write(`print(${printArg})`, element.state.indent)
                                            break;
                                        }
                            }
                            break;
                        }
                        break;
                }
            });
        }   
        let fd = new FormData();
        let file = new File(code,'code.txt',{type: "text/plain"})
        fd.append('file',file)
        $.ajax({
            url: '/code/set_python/' + slug,
            data: fd,
            type: 'POST',
            contentType: false,
            processData: false, 
            success:(data)=>{
                console.log(data)
            },
            error:(data)=>{
                console.log(data)
            }
        })
    }
}

const write = (string, indent) => {
    let finalString = ""
    for (i = 0; i < (indent / 4); i++) {
        finalString += "\t"
    }
    code.push(finalString + string + "\n")
}