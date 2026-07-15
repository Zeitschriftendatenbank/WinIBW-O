var MISC;

function toJSON(ppn) {
    return JSON.create(ppn);
}
/**
 * Retrieves and parses a record in JSON format based on the given PPN.
 *
 * @param {string|boolean} ppn - The PPN of the record to retrieve. If `false`, retrieves the current record.
 * @returns {Object} An object representing the parsed  record, where each key corresponds to a category
 *                   and its value is an array of parsed field data. Includes a `katToString` method for
 *                   converting a category to a formatted string.
 */
var JSON = {
    create: function (ppn) {
        var recObj = {};
        // save format
        var format = MISC.format();
        var myWindowId = activeWindow.windowID;

        if (ppn) // get zdb id of a different title in a work window
        {
            MISC.wait('\\ZOE \\PPN ' + ppn, true);
        }

        if ('P' != format) MISC.format('P');

        var rec = MISC.getExpansionFromP3VTX();
        // get array of lines
        var arrLines = rec.match(/(.+)/gm) || [];
        // for each line
        var i = 0;
        while (i < arrLines.length) {
            var _line = JSON.parseField(arrLines[i]);
            // key is the category
            for (var key in _line) {
                if (_line.hasOwnProperty(key)) {
                    // if key already exists
                    if (recObj.hasOwnProperty(key)) {
                        recObj[key].push(_line[key]);
                    } else { // key does not exist
                        // always create an array
                        recObj[key] = [_line[key]];
                    }
                }
            }
            i++;
        }

        // capture delimiter for closure use
        var delim = this.delimiter;
        recObj.katToString = (function (r, d) {
            return function (kat) {
                var string = '',
                    i, sub, x;
                for (i = 0; i < r[kat].length; i++) {
                    string += "\n" + kat + ' ';
                    for (sub in r[kat][i]) {
                        if (!r[kat][i].hasOwnProperty(sub)) continue;
                        for (x = 0; x < r[kat][i][sub].length; x++) {
                            string += d + sub + r[kat][i][sub][x];
                        }
                    }
                }
                return string;
            };
        })(recObj, delim);

        // back to source format
        if ('P' != format) MISC.format(format);

        if (activeWindow.windowID != myWindowId) {
            closeWindow(myWindowId);
        }
        return recObj;
    }
};

/**
* Liest ein Feldinhalt in ein Object
* Bsp.:
* 039E $bf$aFortsetzung von$9942987667$8--Cbvz--Deutsche Zentralbücherei für Blinde zu Leipzig: DZB-Nachrichten
* wird zu
* {
*   "039E":
*   {
*      "b": ["f"],
*      "a": ["Fortsetzung von"],
*      "9": ["942987667"],
*      "8": ["--Cbvz--Deutsche Zentralbücherei für Blinde zu Leipzig: DZB-Nachrichten"]
*   }
* }
*
* Zugriff: obj['039E'][9][0] --> "942987667"
* Zugriff: obj['039E']['b'][0] --> "f"
*
* 017A $aee$amg$anw wird zu
* {
*   "017A":
*   {
*       "a": ["ee","mg","nw"]
*   }
* }
* Zugriff: obj['017A']['a'][0] --> "ee"
* Zugriff: obj['017A']['a'][1] --> "mg"
*/
JSON.parseField = function (field) {
    var _field = {};
    var arr = field.match(/^([^\s]+)\s(.+)/);
    if (!arr || arr.length < 3) {
        // Return empty object or handle error gracefully
        return {};
    }
    var del = ('P' == MISC.format()) ? '\u0192' : '$';
     Notify.info(del);
    var split = arr[2].split(del);

    var subfield = {};
    var x = 1;
    while (x < split.length) {
        if (!split[x] || split[x].length === 0) {
            x++;
            continue;
        }
        // In JScript, use .charAt(0) instead of [0] for first character
        var sfTag = split[x].charAt(0);
        var sfValue = split[x].slice(1);
        if (typeof subfield[sfTag] !== 'undefined') {
            subfield[sfTag].push(sfValue);
        } else {
            subfield[sfTag] = [sfValue];
        }
        x++;
    }
    _field[arr[1]] = subfield;
    return _field;
}