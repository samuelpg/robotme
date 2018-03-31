const check = () => {
    $("#errors").hide();
    $("#error-desc").empty();
    let siempreCounter = new Array();
    for (i = 0; i < editor.lineCount(); i++) {
        tokens = editor.getLineTokens(i)
        tokens.some((element, index) => {
            switch (element.type) {
                case "comment":
                    {
                        return true;
                        break;
                    }
                case "variable":{
                    servo_vars.indexOf(element.string) !== -1 ? error("Error: esta variable esta bloqueada", i) : null;
                    motor_vars.indexOf(element.string) !== -1 ? error("Error: esta variable esta bloqueada", i) : null;
                    ledbuzzer_vars.indexOf(element.string) !== -1 ? error("Error: esta variable esta bloqueada", i) : null;
                    interruption_vars.indexOf(element.string) !== -1 ? error("Error: esta variable esta bloqueada", i) : null;
                }
                case "control":
                    {
                        switch (element.string) {
                            case "siempre":
                                {
                                    siempreCounter.push(element);
                                    if (siempreCounter.length >= 2) error("Error: Solo debe haber un siempre", i)
                                    if (element.state.indent !== 0) error("Error: siempre no puede estar indentado", i)
                                    return true;
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
                                    return true;
                                    break;
                                }
                        }
                        break;
                    }
                case "servo":
                    {
                        if (element.string == "girar") {
                            checkIndent(element, i)
                            posible_values = ["0", "90", "180"]
                            if (servo_vars.indexOf(tokens[index + 2].string) < 0) error("Error: variable de tipo difente a servo", i)
                            if (posible_values.indexOf(tokens[index + 4].string) < 0) error("Error: valor de grado no valido", i)
                            if (tokens[index + 6].string !== "grados") error("Error: Instruccion incompleta", i)
                        }
                        return true;
                        break;
                    }
                case "ledbuzzer":
                    {
                        checkIndent(element, i)
                        if (ledbuzzer_vars.indexOf(tokens[index + 2].string) < 0) error("Error: variable de tipo difente a ledbuzzer", i)
                        return true;
                        break;
                    }
                case "motor":
                    {
                        checkIndent(element, i)
                        if (motor_vars.indexOf(tokens[index + 2].string) < 0) error("Error: variable de tipo difente a motor ", i)
                        return true;
                        break
                    }
                case "interruption":
                    {
                        if (element.string === "cuando") {
                            if (interruption_vars.indexOf(tokens[index + 2].string) < 0) error("Error: variable de interrupcion no valida", i)
                            if (tokens[index + 4].string !== "detecte") error("Error: instruccion incompleta", i)
                            if (tokens[index + 8].string !== "entonces") error("Error: instruccion incompleta", i)
                            tokens[index + 6].string === "bajo"?  null : tokens[index + 6].string !== "alto" ? error("Error: valor de caida no valido", i) : null;
                            siempreCounter.length > 0 ? error("Error: Las interrupciones deben ir antes del siempre", i) : null;
                        }
                        return true;
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
                                    if (tokens[index + 4].string !== "segundos") error("Error: Instruccion incompleta", i)
                                    break;
                                }
                            case "decir":
                                {
                                    checkIndent(element, i)
                                    let allowed_types = ["string", "number", "variable", "operator"]
                                    let stringsPrint = new Array();
                                    for (j = 0; j < tokens.length; j++) {
                                        stringsPrint.push(tokens[j].string)
                                    }
                                    let start = stringsPrint.indexOf('decir') + 2
                                    for (j = start; j < tokens.length; j++) {
                                        if (allowed_types.indexOf(tokens[j].type) < 0 && tokens[j].type !== null) {
                                            console.log(tokens[j])
                                            error("Error: valor de 'decir' no valido" + j, i)
                                        }
                                    }
                                    break;
                                }
                        }
                        return true;
                        break;
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
    $("#error-desc").append(`
    <tr>
        <td class="error-td">
            ${line + 1}: ${message}
        </td>
    </tr>
    `)
    $("#errors").show();
}

const checkIndent = (element, line) => {
    if (element.state.indent <= 0) error("Error: falta indentacion", line)
}

let code, def, functionNames, interruptionStack, expectedIndent

const parseAndUpload = () => {
    let errors = check()
    if (!errors) {
        code = new Array()
        def = new Array()
        interruptionStack = new Array()
        functionNames = new Array();
        writeArray(importTemplate);
        expectedIndent = 0;
        writeVariables();
        for (let i = 0; i < editor.lineCount(); i++) {
            tokens = editor.getLineTokens(i)
            try{
                if (tokens[0].state.indent == 0 && interruptionStack.length > 0){
                    write(`\n${interruptionStack[0]['name']}_ref = pi.callback(${interruptionStack[0]['variable']},${interruptionStack[0]['state']},${interruptionStack[0]['name']})\n`, 0)
                    interruptionStack.splice(0,1)
                }
            }catch(e){
                
            }
           tokens.some((element, index) => {
                switch (element.type) {
                    case "comment":
                        {
                            return true;
                            break;
                        }
                    case "variable":{
                        let finalString = "";
                        if(tokens[index + 4].string==="Verdadero"||tokens[index + 4].string==="Falso"){
                            tokens[index + 4].string === "Verdadero" ? finalString = `${element.string} = True` : finalString = `${element.string} = False`;
                        }else{
                            for(j = index; j < tokens.length; j++){
                                finalString += tokens[j].string;
                            }
                        }
                        write(finalString, element.state.indent + expectedIndent);
                        return true;
                        break;
                    }
                    case "control":
                        {   
                            if (element.string === "siempre"){
                                write("try:", 0)
                                write("while True:", 4);
                                expectedIndent = 4;
                            }
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
                                write(`if ${condition}:`, element.state.indent + expectedIndent)
                            }
                            if (element.string === "sino") write("else", element.state.indent + expectedIndent)
                            return true;
                            break;
                        }
                    case "servo":
                        {
                            if (element.string == "girar") {
                                let varName = tokens[index + 2].string;
                                switch (tokens[index + 4].string) {
                                    case "0":
                                        {
                                            write(`pi.set_servo_pmw(${varName},1500)`, element.state.indent + expectedIndent)
                                            break;
                                        }
                                    case "90":
                                        {
                                            write(`pi.set_servo_pmw(${varName},2000)`, element.state.indent + expectedIndent)
                                            break;
                                        }
                                    case "180":
                                        {
                                            write(`pi.set_servo_pmw(${varName},2500)`, element.state.indent + expectedIndent)
                                            break;
                                        }
                                }
                            }
                            return true;
                            break;
                        }
                    case "ledbuzzer":
                        {
                            let varName = tokens[index + 2].string
                            if (element.string === "encender") {
                                write(`pi.write(${varName}, 1)`, element.state.indent + expectedIndent)
                            } else {
                                write(`pi.write(${varName}, 0)`, element.state.indent + expectedIndent)
                            }
                            return true;
                            break;
                        }
                    case "motor":
                        {
                            let varName = tokens[index + 2].string
                            if (element.string === "mover") {
                                write(`pi.write(${varName}, 1)`, element.state.indent + expectedIndent)
                            } else {
                                write(`pi.write(${varName}, 0)`, element.state.indent + expectedIndent)
                            }
                            return true;
                            break;
                        }
                    case "interruption":
                        {
                            if (element.string === "cuando") {
                                let state;
                                let function_name = getRandomFunctionName();
                                write(`def ${function_name}(gpio, level, tick):`, element.state.indent);
                                tokens[index + 6].string == "alto" ? state = "pigpio.RISING_EDGE" : state = "pigpio.FALLING_EDGE";;
                                interruptionStack.push({
                                    "name":name,
                                    "state":state,
                                    "variable":tokens[index + 2].string
                                });
                                return true;
                            }
                            break;
                        }
                    case "other":
                        {
                            switch (element.string) {
                                case "esperar":
                                    {
                                        write(`sleep(${tokens[index+2].string})`, element.state.indent + expectedIndent)
                                        return true;
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
                                        write(`printf(${printArg})`, element.state.indent + expectedIndent)
                                        return true;
                                        break;
                                    }
                            }
                            break;
                        }
                        break;
                }
            });
        }
        writeArray(exceptTemplate)
        writeFinally()
        let fd = new FormData();
        let file = new File(code, 'code.txt', {
            type: "text/plain"
        })
        fd.append('file', file)
        $.ajax({
            url: '/code/set_python/' + slug,
            data: fd,
            type: 'POST',
            contentType: false,
            processData: false,
            success: (data) => {
                console.log(data)
                $('#console-modal').show()
            },
            error: (data) => {
                console.log(data)
            }
        })
    }
}

const write = (string, indent) => {
    let finalString = ""
    for (i = 0; i < (indent / 4); i++) {
        finalString += "    "
    }
    code.push(finalString + string + "\n")
}

const getRandomFunctionName = () =>{
    let words = ['red','blue','yellow','green','purple','orange','pink']
    name = "function_" + words[Math.floor(Math.random()*words.length)]
    if(functionNames.indexOf(name)===-1){
        functionNames.push(name);
        return name;
    }else{
        if(functionNames.length < 7){
            return getRandomFunctionName();
        }else{
            return null;
        }
    }
}

const writeVariables = () =>{
    let real_pins = [4, 17, 18, 27, 22, 23, 24, 25];
    variables.forEach((element)=>{
        write(`${element['nme_variable']} = ${real_pins[element['pin_variable']-1]}`, 0)
    })
    write("\n")
}

const writeFinally = ()=>{
    variables.forEach((element)=>{
        let type = element['tpe_variable']
        if(type != "button" && type != "pir"){
            write(`pi.write(${element['nme_variable']}, 0)`, 4)
        }
    })
    functionNames.forEach((element)=>{
        write(`${element}_ref.cancel()`, 4)
    })
}

const writeArray = (array) =>{
    array.forEach((element)=>{
        write(element, 0);
    })
}