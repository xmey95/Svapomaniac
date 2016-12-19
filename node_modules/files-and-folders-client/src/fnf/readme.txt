



###############################################################################################
für das Verschieben von tabs:
    http://angular-dragdrop.github.io/angular-dragdrop/examples/
    https://github.com/angular-dragdrop/angular-dragdrop
    https://github.com/angular-dragdrop/angular-dragdrop/blob/master/draganddrop.js

    https://blog.parkji.co.uk/2013/08/11/native-drag-and-drop-in-angularjs.html

    http://www.w3schools.com/jsref/event_ondrag.asp




###############################################################################################



mv<https://www.npmjs.com/package/mv>

fs.rename but works across devices. same as the unix utility 'mv'

https://github.com/andrewrk/node-mv
https://www.npmjs.com/package/mv

Usage:
var mv = require('mv');

mv('source/file', 'dest/file', function(err) {
  // done. it tried fs.rename first, and then falls back to
  // piping the source file to the dest file and then unlinking
  // the source file.
});
Another example:
mv('source/dir', 'dest/a/b/c/dir', {mkdirp: true}, function(err) {
  // done. it first created all the necessary directories, and then
  // tried fs.rename, then falls back to using ncp to copy the dir
  // to dest and then rimraf to remove the source dir
});
Another example:
mv('source/file', 'dest/file', {clobber: false}, function(err) {
  // done. If 'dest/file' exists, an error is returned
  // with err.code === 'EEXIST'.
}

-----------------
FXP :
https://de.wikipedia.org/wiki/File_Exchange_Protocol
http://www.crossftp.com/kb/entry/23/

CrossFTP Knowledgebase / CrossFTP & CrossFTP Pro / Features / What is FXP (Site to Site) transfer?
What is FXP (Site to Site) transfer?

Print
Email to friend
Add comment
  Rate it
Views: 16450
Votes: 0
Comments: 0
Posted: 20 Sep, 2007
by: Admin A.
Updated: 18 Oct, 2007
by: Admin A.
FXP stands for File eXchange Protocol. It lets you copy files from one FTP-server to another using an FXP-client without going through your local machine. There are two precondition for the FXP operation:
Both server must support the FXP and have it enabled. Many servers do not enable it due by default to potential security risk.
One server should support PASV mode and the other server must allow PORT commands from a foreign address.

The following is a diagram showing the example of an FXP transfer.
                   Control     ------------   Control
                    ---------->| User-FTP |<-----------
                    |          | User-PI  |           |
                    |          |   "C"    |           |
                    V          ------------           V
            --------------                        --------------
            | Server-FTP |   Data Connection      | Server-FTP |
            |    "A"     |<---------------------->|    "B"     |
            -------------- Port (A)      Port (B) --------------

                        Figure 1. FXP example

You can FXP files using CrossFTP by opening a remote server tab in the left and right side. (To create a new remote tab, choose File -> New Tab) Then you can drag and drop between these two remote tabs to make the FXP transfers. Here is a Flash tutorial for the FXP operation in CrossFTP for your reference. You can view more CrossFTP tutorials from our Tutorial page.

-------------------------------------------------------------------------------------------------------------------------

http://www.binarynights.com/forklift/

Ideas:

FXP Copy
FXP Copy lets you transfer data directly between FXP-enabled servers, without passing the data through your desktop machine.

Terminal
An absolute must for powerusers. Faster than you can say 'HAL' ForkLift will open a Terminal window at your current path.

Multi-rename
When you have the dead boring job of renaming a frightening amount of files this feature will make you happy you grabbed a license.

Delete App
Delete dublicates Assistent

Full Keyboard Control
Control every operation straight from the keyboard including selecting files. Customize shortcuts or use one of our default sets.

Archives
Browse local and remote zip, RAR, gz and tar archives as if they were ordinary folders. You can even Quick Look, search and filter!


-------------------------------------------------------------------------------------------------------------------------

// http://paulferrett.com/fontawesome-favicon/
// http://fontawesome.io/icons/
// https://mothereff.in/html-entities

------------------------------------------------------------------------------------------------------------------------
It would be great if mouse/keyboard selection works like the way you would expect it (by default)
and that we could override the behaviour by catching the keyboard event callbacks

MOUSE:
click = deselect all rows and select the current row
CTRL+click = select or deselect current row
shift + click = add all rows from previous selected row to current row to selection

KEYBOARD
HOME = goto first row
END = goto last row
cursor up/down = deselect all rows and select the current row
shift+cursor up = add previous row to selection
shift+cursor down = add next row to selection
SPACE = select or deselect current row
CTRL+SHIFT+HOME = select all rows from current position to top
CTRL+SHIFT+END = select all rows from current position to end
----------------------------------------------------------------------------------------------------------------------



