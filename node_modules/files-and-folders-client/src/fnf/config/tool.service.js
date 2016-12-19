(function () {
    'use strict';

    angular
        .module('toolService', [])
        .factory('toolService', toolService);

    toolService.$inject = ['$log'];

    function toolService($log) {
        var ret = {};

        var getDefaultTools = function getDefaultTools(systemFlags) {
            $log.info('getDefaultTools()', systemFlags);
            var ret = [];

            if (systemFlags.windows) {
                ret.push({
                    id: 'CMD_SHELL',
                    label: 'CMD Shell',
                    shortcut: 'control shift m', // todo $_dirname
                    cmd: '$clidir\\cmd.bat', // (server/cli/cmd.bat ->) start C:\Windows\System32\cmd.exe /a /k cd /d %1
                    para: ' $dir ',
                    local: true
                });

            } else if (systemFlags.osx) {
                ret.push({
                    id: 'EDIT_FILE',
                    label: 'Edit',
                    shortcut: 'control 4',
                    // ln -s "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" /usr/local/bin/sublime
                    // see http://olivierlacan.com/posts/launch-sublime-text-3-from-the-command-line/
                    cmd: 'sublime',
                    fileLimit: 4,
                    para: ' $file ',
                    local: true
                });
                ret.push(      {
                    "id": "CMD_SHELL",
                    "label": "CMD Shell",
                    "shortcut": "control 0",
                    "cmd": "open -a Terminal ",
                    "para": " $dir ",
                    "local": true
                });
                ret.push({
                    "id": "CMD_REVEAL_IN_FINDER",
                    "label": "Reveal in Finder",
                    "shortcut": "control shift f",
                    "cmd": "open ",
                    "para": " $dir ",
                    "local": true
                });

                // https://www.npmjs.com/package/ttab#manual-installation
                // https://www.safaribooksonline.com/library/view/mac-os-x/9780596520625/ch01.html
                // http://stackoverflow.com/questions/7171725/open-new-terminal-tab-from-command-line-mac-os-x

            } else if (systemFlags.linux) {
                
            }
            
            return ret;
        };

        ret.getDefaultTools = getDefaultTools;
        return ret;
    }

}());