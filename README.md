YACE: Yet Another Collaborative Editor!
==

We've got prenty of those starting from Etherpad, Etherpad-lite, Coderpad, and so 
many mores... Now there's a new one that pwns: it's YACE!

Features
--

 * Markdown text editing
 * WYSIWYG text editing
 * Code edition
 * Code execution
 * Realtime collaboration on code

DEPENDENCIES
--

 * [share.js][0]
 * [jquery terminal plugin][1]
 * [Repl interpreter's library][2]
 * [Ajax-ACE full blown editor][3]
 * [Showdown, Markdown-HTML converter][4]
 * [googlediff][5]
 * [twitter's bootstrap.js][6]

[0]:http://sharejs.org/
[1]:http://terminal.jcubic.pl/
[2]:http://repl.it/
[3]:http://ace.ajax.org/
[4]:https://github.com/coreyti/showdown
[5]:http://code.google.com/p/google-diff-match-patch/
[6]:http://twitter.github.io/bootstrap


INSTALL
--

Be sure to have nodejs installed on your host:

    apt-get install nodejs

or follow [the documentation][7]

then, install the basic node utilities needed to compile dependencies:

    sudo npm install -g coffee-script uglify-js recess

and finally, just run the build script:

    sh build.sh

[7]:https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager

RUN
--

To run the script, you need to execute:

    node lib/index.js

which will run the service on `localhost:3000`. Then you can proxy it through your
web server.


TODO
--

 * integration with editors
 * Chat service
 * Color differenciation for each writer
 * Annotations?
 * Accounts management and private pads
 * 0 bugs

LICENSE
--

All original code is under [AGPLv3](http://www.gnu.org/licenses/agpl-3.0.html).
Everything else is in their respective license.

