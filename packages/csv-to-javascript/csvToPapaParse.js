const Papa = require("papaparse");

const papa = function(file, options){
    const parser = Papa;
    const defaultOptions = Object.assign({
        delimiter: "",	// auto-detect
        newline: "",	// auto-detect
        quoteChar: '"',
        escapeChar: '"',
        header: false,
        transformHeader: undefined,
        dynamicTyping: false,
        preview: 0,
        encoding: "",
        worker: false,
        comments: false,
        step: undefined,
        error: undefined,
        download: false,
        downloadRequestHeaders: undefined,
        skipEmptyLines: false,
        chunk: undefined,
        fastMode: undefined,
        beforeFirstChunk: undefined,
        withCredentials: undefined,
        transform: undefined,
        delimitersToGuess: [',', '\t', '|', ';', papa.RECORD_SEP, papa.UNIT_SEP]
    }, options);

    let array;
    parser.parse(file,
        Object.assign(defaultOptions,{
            complete: function(results) {
                array = results.data;
            }
        })
    );
    return array;
};
module.exports = papa;
