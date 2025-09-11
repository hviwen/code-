function firstWord(text) {
    const m = text.match(/[A-Za-z0-9]+/)
    return m ? m[0] : ""
}