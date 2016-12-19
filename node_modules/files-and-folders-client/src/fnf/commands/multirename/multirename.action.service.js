(function () {
    'use strict';


    /*
     [[N]___________________________].[[E]___]
     [N] Name
     [N#-#] Part of name
     [E] Extension
     [E#-#] Part of extension
     [C] Counter
     [D] Dir
     [P] Parent dir

     Counter Start: 1[V], Step: 1[V],  Digits [V]: '1', '02', '003', '0004', '00005', '000006', '0000007', '00000008' , '00000009', '000000010'

     [x] Search an d replace:
     [x] Replace [______] with [_______]  [x] RegExp (evtl  [x] If  match[   ]) [Templates ...]
     [x] Replace [______] with [_______]  [x] RegExp
     [x] Replace [______] with [_______]  [x] RegExp
     [x] Replace [______] with [_______]  [x] RegExp
     [x] Replace german umlauts  (ü -> ue, Ü - > Ue, ...)
     [x] Replace risky chars with [_]
     [x] Replace space to underscore
     [x] Replace parent dir with [        ]

     [to lowercase][V]
     to uppercase
     capitalize first letter
     capitalize words
     capitalize chicagomanualofstyle (http://ejohn.org/files/titleCaps.js,
     http://titlecapitalization.com/,
     http://www.chicagomanualofstyle.org/)


     Templates ...
     Remove brackets
     Brackets to end
     [prename] [lastname] - [title] -> [lastname], [prename] - [title]

     */

    angular
        .module('multirenameActionService', [])
        .factory('multirenameActionService', multirenameActionService);

    multirenameActionService.$inject = ['mainService', 'multirenameDataService', 'commandService', '$log'];

    function multirenameActionService(mainService, multirenameDataService, commandService, $log) {
        $log.info('multirenameActionService...');

        var getSelectedFilesAndFolders = mainService.getSelectedFilesAndFolders;
        var slash = mainService.slash;
        var getSourcePanelIndex = mainService.getSourcePanelIndex;

        var getDialogData = multirenameDataService.getDialogData;

        var data = getDialogData();

        // http://ejohn.org/files/titleCaps.js, http://titlecapitalization.com/, http://www.chicagomanualofstyle.org/
        var titleCaps = function titleCaps(title) {
            var small = "(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)";
            var punct = "([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)";
            var parts = [], split = /[:.;?!] |(?: |^)["Ò]/g, index = 0;
            var lower = function lower(word) {
                return word.toLowerCase();
            };
            var upper = function upper(word) {
                return word.substr(0, 1).toUpperCase() + word.substr(1);
            };

            while (true) {
                var m = split.exec(title);

                parts.push(title.substring(index, m ? m.index : title.length)
                    .replace(/\b([A-Za-z][a-z.'Õ]*)\b/g, function (all) {
                        return /[A-Za-z]\.[A-Za-z]/.test(all) ? all : upper(all);
                    })
                    .replace(RegExp("\\b" + small + "\\b", "ig"), lower)
                    .replace(RegExp("^" + punct + small + "\\b", "ig"), function (all, punct, word) {
                        return punct + upper(word);
                    })
                    .replace(RegExp("\\b" + small + punct + "$", "ig"), upper));

                index = split.lastIndex;

                if (m) parts.push(m[0]);
                else break;
            }

            return parts.join("").replace(/ V(s?)\. /ig, " v$1. ")
                .replace(/(['Õ])S\b/ig, "$1s")
                .replace(/\b(AT&T|Q&A)\b/ig, function (all) {
                    return all.toUpperCase();
                });
        };

        var capitalize = function capitalize(s) {
            return s.replace(/(?:^|\s)\S/g, function (a) {
                return a.toUpperCase();
            });
        };

        var pad = function pad(str, max) {
            return str.length < max ? pad("0" + str, max) : str;
        };

        var replaceUmlauts = function replaceUmlauts(str) { // TODO grosser mist!
            return str
                .replace(/Â|À|Å|Ã/g, "A")
                .replace(/â|à|å|ã/g, "a")
                .replace(/Ä/g, "AE")
                .replace(/ä/g, "ae")
                .replace(/Ç/g, "C")
                .replace(/ç/g, "c")
                .replace(/É|Ê|È|Ë/g, "E")
                .replace(/é|ê|è|ë/g, "e")
                .replace(/Ó|Ô|Ò|Õ|Ø/g, "O")
                .replace(/ó|ô|ò|õ/g, "o")
                .replace(/Ö/g, "OE")
                .replace(/ö/g, "oe")
                .replace(/Š/g, "S")
                .replace(/š/g, "s")
                .replace(/ß/g, "ss")
                .replace(/Ú|Û|Ù/g, "U")
                .replace(/ú|û|ù/g, "u")
                .replace(/Ü/g, "UE")
                .replace(/ü/g, "ue")
                .replace(/Ý|Ÿ/g, "Y")
                .replace(/ý|ÿ/g, "y")
                .replace(/Ž/g, "Z")
                .replace(/ž/, "z")
                .replace(/\u00d6/g, "Oe")
                .replace(/\u00f6/g, "oe")
                .replace(/\u00d6/g, "Ue")
                .replace(/\u00fc/g, "ue")
                .replace(/\u00c4/g, "Ae")
                .replace(/\u00e4/g, "ae")
                .replace(/\u00df/g, "ß")
                .replace(/\u0099/g, "Oe")
                .replace(/\u0094/g, "oe")
                .replace(/\u009A/g, "Ue")
                .replace(/\u0081/g, "ue")
                .replace(/\u008e/g, "Ae")
                .replace(/\u0084/g, "ae")
                ;
        };

        // todo  die Ersetzungen sollten sich auch auf ext beziehen, da  ext==name bei Verzeichnissen
        var rename = function rename(file, data, index) {
            var pattern = data.name;

            var ext = file.base.split('.').pop();
            var name = file.base.substr(0, file.base.lastIndexOf(ext) - 1);
            var parent = slash(file.dir).split('/').pop();

            //if (file.isDir) {
            //    name = file.base;
            //    ext = '';
            //}

            if (data.capitalizeMode === 'chicago_manual_of_style') {
                name = titleCaps(name);
            } else if (data.capitalizeMode === 'lowercase') {
                name = name.toLowerCase();
            } else if (data.capitalizeMode === 'uppercase') {
                name = name.toUpperCase();
            } else if (data.capitalizeMode === 'capitalize_first_letter') {
                name = name.charAt(0).toUpperCase() + name.slice(1);
            } else if (data.capitalizeMode === 'capitalize_words') {
                name = capitalize(name);
            }

            if (data.replaceGermanUmlauts) {
                name = replaceUmlauts(name);
            }
            if (data.replaceRiskyChars) {
                name = name.replace(/[^a-zA-Z0-9_ \[\]\(\)\-\.]/g, '')
            }
            if (data.replaceSpaceToUnderscore) {
                name = name.replace(/ /g, '_');
            }
            if (data.replaceParentDir) {
                name = name.replace(parent, '');
            }

            var base = pattern
                .replace(/\[N\]/g, name)
                .replace(/\[E\]/g, ext)
                .replace(/\[P\]/g, parent);

            // Bereiche aus Namen, Extension und Parent:
            var m = base.match(/\[N(\d+)\-(\d+)\]/);
            if (m) {
                base = base.replace(m[0], name.substring(parseInt(m[1]), parseInt(m[2])));
            }
            m = base.match(/\[N(\d+)\-\]/);
            if (m) {
                base = base.replace(m[0], name.substring(parseInt(m[1])));
            }
            m = base.match(/\[N\-(\d+)\]/);
            if (m) {
                base = base.replace(m[0], name.substring(0, parseInt(m[1])));
            }

            m = base.match(/\[E(\d+)\-(\d+)\]/);
            if (m) {
                base = base.replace(m[0], ext.substring(parseInt(m[1]), parseInt(m[2])));
            }
            m = base.match(/\[E(\d+)\-\]/);
            if (m) {
                base = base.replace(m[0], ext.substring(parseInt(m[1])));
            }
            m = base.match(/\[E\-(\d+)\]/);
            if (m) {
                base = base.replace(m[0], ext.substring(0, parseInt(m[1])));
            }

            m = base.match(/\[P(\d+)\-(\d+)\]/);
            if (m) {
                base = base.replace(m[0], parent.substring(parseInt(m[1]), parseInt(m[2])));
            }
            m = base.match(/\[P(\d+)\-\]/);
            if (m) {
                base = base.replace(m[0], parent.substring(parseInt(m[1])));
            }
            m = base.match(/\[P\-(\d+)\]/);
            if (m) {
                base = base.replace(m[0], parent.substring(0, parseInt(m[1])));
            }

            if (base.indexOf('[C]') > -1) {
                var counterStart = parseInt(data.counterStart);
                var counterStep = parseInt(data.counterStep);
                var counterDigits = parseInt(data.counterDigits);
                var n = counterStart + (index * counterStep);
                var s = pad('' + n, counterDigits);

                base = base.replace(/\[C\]/g, s);
            }

            if (data.replacementsChecked) {
                // replacements:
                for (var i = 0; i < data.replacements.length; i++) {
                    base = replace(base, data.replacements[i]);
                }
            }

            return {
                dir: file.dir,
                base: base
            };
        };

        var replace = function replace(base, rep) {
            base = base.replace(/\s+/g," "); // replace whitespaces (&nbsp; = char 160) to normal spaces!
            if (rep.checked) {
                if (!rep.ifFlag || ifmatch(rep.ifMatch, base)) {
                    // http://stackoverflow.com/questions/874709/converting-user-input-string-to-regular-expression
                    var match = rep.textFrom.match(new RegExp('^/(.*?)/([gimy]*)$'));
                    if (match && rep.regExpr) {
                        var regex = new RegExp(match[1], match[2]);
                        base = base.replace(regex, rep.textTo).replace(/,,/g, ',');
                    } else {
                        base = base.replace(rep.textFrom, rep.textTo);
                    }
                }
            }
            return base;
        };

        var ifmatch = function ifmatch(what, base) {
            var match = what.match(new RegExp('^/(.*?)/([gimy]*)$'));
            if (match) {
                var regex = new RegExp(match[1], match[2]);
                return base.match(regex);
            }
            return base.indexOf(what) > -1;
        };

        var multiRenameRows = [];

        var initTableModel = function initTableModel() {
            var selectedFiles = getSelectedFilesAndFolders();
            multiRenameRows = [];
            var i;
            for (i = 0; i < selectedFiles.length; i++) {
                var file = selectedFiles[i];
                var source = {
                    base: file.base,
                    dir: file.dir
                };
                var target = rename(source, data.data, i);
                multiRenameRows.push({
                    id: i,
                    source: source,
                    target: target,
                    changed: source.base != target.base
                });
            }
            data.data.gridOptions.api.setRowData(multiRenameRows);
        };

        var softUpdateTableModel = function softUpdateTableModel() {
            var i, j;
            for (i = 0; i < multiRenameRows.length; i++) {
                var row = multiRenameRows[i];
                row.target = rename(row.source, data.data, i);
                row.status = row.source.base != row.target.base ? 'OK' : 'Untouched';
            }
            for (i = 0; i < multiRenameRows.length; i++) {
                for (j = i + 1; j < multiRenameRows.length; j++) {
                    if (multiRenameRows[i].target.base === multiRenameRows[j].target.base &&
                        multiRenameRows[i].target.dir === multiRenameRows[j].target.dir) {
                        multiRenameRows[i].status = 'Error';
                        multiRenameRows[j].status = 'Error';
                    }
                }
            }
            data.data.gridOptions.api.setRowData(multiRenameRows);
            var sort = [
                {colId: 'status', sort: 'asc'},
                {colId: 'id', sort: 'asc'}
            ];
            data.data.gridOptions.api.setSortModel(sort);
        };

        var multirename = function multirename() {
            var srcPanelIndex = getSourcePanelIndex();
            var actions = [];

            for (var i = 0; i < multiRenameRows.length; i++) {
                var row = multiRenameRows[i];
                if (row.status === 'OK') {
                    actions.push(
                        commandService.rename({
                            bulk: multiRenameRows.length > commandService.BULK_LOWER_LIMIT,
                            src: row.source,
                            srcPanelIndex: srcPanelIndex,
                            target: row.target
                        })
                    );
                }
            }
            if (actions.length > 0) {
                commandService.addActions(actions);
            }
            mainService.storeLastRowIndex();
            actions.push(commandService.refreshPanel(srcPanelIndex));
        };

        var ret = {};
        ret.getDialogData = getDialogData;
        ret.multirename = multirename;
        ret.initTableModel = initTableModel;
        ret.softUpdateTableModel = softUpdateTableModel;
        return ret;
    }

}());