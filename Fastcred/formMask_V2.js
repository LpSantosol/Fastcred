function moeda(a, e, r, t) {
    let n = ""
      , h = j = 0
      , u = tamanho2 = 0
      , l = ajd2 = ""
      , o = window.Event ? t.which : t.keyCode;
      a.value = a.value.replace('R$ ','');            
    if (n = String.fromCharCode(o),
    -1 == "0123456789".indexOf(n))
        return !1;
    for (u = a.value.replace('R$ ','').length,
    h = 0; h < u && ("0" == a.value.charAt(h) || a.value.charAt(h) == r); h++)
        ;
    for (l = ""; h < u; h++)
        -1 != "0123456789".indexOf(a.value.charAt(h)) && (l += a.value.charAt(h));
    if (l += n,
    0 == (u = l.length) && (a.value = ""),
    1 == u && (a.value = "R$ 0" + r + "0" + l),
    2 == u && (a.value = "R$ 0" + r + l),
    u > 2) {
        for (ajd2 = "",
        j = 0,
        h = u - 3; h >= 0; h--)
            3 == j && (ajd2 += e,
            j = 0),
            ajd2 += l.charAt(h),
            j++;
        for (a.value = "R$ ",
        tamanho2 = ajd2.length,
        h = tamanho2 - 1; h >= 0; h--)
            a.value += ajd2.charAt(h);
        a.value += r + l.substr(u - 2, u)
    }
    return !1
}




class FormMask {

    constructor(element, mask, replacementChar, charsToIgnore) {

        element.type = "tel"
        element.FormMask = this
        
        this.input = element
        this.mask = mask
        this.char = replacementChar
        this.specialChars = charsToIgnore

        this.applyListeners()

    }

    applyListeners() {

        this.input.addEventListener("focus", () => this.moveCursorToStart()) //empty case, add mask and go to the beginning
        this.input.addEventListener("click", () => this.moveCursorToStart())

        this.input.addEventListener("blur", e => {

            const inputChars = this.input.value.split("")
            const ignore = inputChars.indexOf(this.char) < 0

            const className = ignore ? "valid" : "invalid"

            this.cleanAndSetClasses(this.input, [className])

            if(this.input.value == this.mask) this.input.value = ""

        })
    
        this.input.addEventListener("keydown", e => {
    
            if(e.key == "Backspace" || e.key == "Delete") {
                
                this.deleteValue( this.input.value.split("") )
                e.preventDefault()

            }

        })
    
        this.input.addEventListener("beforeinput", e => {

            e.preventDefault()
    
            const key = e.key || e.data
            const numberKey = (!isNaN(key) && key != " ") //(" " == 0) to javascript

            if(!numberKey) return

            const inputChars = this.input.value.split("")

            this.maskPattern(inputChars, key)

        })
    
        this.input.addEventListener("paste", e => {
    
            const data = e.clipboardData.getData("text")
    
            this.onPasteData(data)

            e.preventDefault()

        })

    }

    moveCursorToStart() {

        this.cleanAndSetClasses(this.input, [])

        if(this.input.value == "" || this.input.value == this.mask) {

            this.input.value = this.mask

            const inputChars = this.input.value.split("")
            const indexToStart = inputChars.indexOf(this.char)

            this.input.setSelectionRange(indexToStart, indexToStart) //cursor position

        }

    }

    cleanAndSetClasses(element, classes) {

        element.classList.remove("valid", "invalid")
        classes.forEach(className => element.classList.add(className))

    }

    maskPattern(inputChars, key) {

        let cursor = this.input.selectionStart
        
        for(let i=cursor; i<inputChars.length; i++) { //grant to skip all special chars on insert

            let ignore = this.specialChars.indexOf(inputChars[i]) >= 0 //if special char, ignore (increment cursor)

            if(!ignore) break
            
            cursor++ //jump to next char != ignored

        }
        
        inputChars.splice(cursor, 1, key)
        
        this.insertValue(inputChars.join(""), cursor+1)

    }

    insertValue(result, cursor) {

        if(result.length != this.mask.length) return

        this.input.value = result

        if(cursor >= 0) this.input.setSelectionRange(cursor, cursor)

    }

    deleteValue(inputChars) {

        const withoutSelectionRange = this.checkSelectionRange(inputChars)

        if(!withoutSelectionRange) return

        let cursor = this.input.selectionStart

        for(let i=0; i<inputChars.length; i++) { //skip special chars on delete

            let ignore = this.specialChars.indexOf(inputChars[cursor-1]) >= 0

            if(!ignore) break
            
            cursor -= 1

        }

        inputChars.splice(cursor-1, 1, this.char)

        this.insertValue(inputChars.join(""), cursor-1)

    }

    checkSelectionRange(inputChars) {

        if(this.input.selectionStart == this.input.selectionEnd) return true

        let start = this.input.selectionStart
        let end = this.input.selectionEnd

        for(let i=start; i<end; i++) {

            let nonSpecialChar = this.specialChars.indexOf(inputChars[i]) < 0
            
            if(nonSpecialChar) inputChars.splice(i, 1, this.char)

        }

        this.insertValue(inputChars.join(""), start)

        return false

    }

    onPasteData(data) {
        
        const maskChars = this.mask.split("")
        const dataChars = data.split("")

        const onlyNumbers = dataChars.filter( value => !isNaN(value) && value != " " )
        const maskWithoutSpecialChars = maskChars.filter( value => value == this.char )

        const numberOfChars = maskWithoutSpecialChars.length

        for(let i=0; i<numberOfChars; i++) {

            let positionChar = maskChars.indexOf(this.char)
            let number = onlyNumbers[i] || this.char

            maskChars.splice(positionChar, 1, number)
        }

        this.input.value = ""

        this.insertValue(maskChars.join(""), maskChars.indexOf(this.char))

        

    }

    

}