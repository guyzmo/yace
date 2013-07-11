(function() {
    // rtfm
    var bs_modals = function(title, content) {
        $('#modal').html( '<div id="r" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
                        + '    <div class="modal-header">'
                        + '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'
                        + '        <h3 id="myModalLabel">'+title+'</h3>'
                        + '    </div>'
                        + '    <div class="modal-body">'
                        +           content
                        + '    </div>'
                        + '    <div class="modal-footer">'
                        + '        <button class="btn" data-dismiss="modal" aria-hidden="true">Dismiss</button>'
                        + '    </div>'
                        + '</div>')
        $("#modal .modal").on("show", function() {
            $("#modal-rtfm .close").on("click", function(e) {
                $("#modal-rtfm").modal('hide');
            });
        });
        $("#modal .modal").on("hide", function() {
            $("#modal-rtfm .close").off("click");
        });
        $("#modal .modal").on("hidden", function() {
            $("#modal-rtfm").remove();
        });
        $("#modal .modal").modal({
            "backdrop" : "static",
            "keyboard" : true,
            "show" : true 
        });
    }
    // notifications
    var bs_progress = function(title, message, loaded) {
        var ret = '<div class="alert alert-info fade in transparent">'
                + '    <h4 class="alert-heading">'+title+'</h4>'
                + '    <p>'+message+'</p>'
                + '    </p>'
                + '</div>';
        $('#alert').html(ret);
        $('#overlay').fadeIn();
        $('#pbar').html('<div class="progress progress-striped active">'
                        + '    <div class="bar" style="width: '+((loaded*5)%100)+'%;"></div>'
                        + '</div>')
        return {
            update: function(val) {
                $('#overlay #pbar .bar').css('width', (val%100)+"%");
            },
            done: function() {
                $('#overlay #pbar .bar').css('width', "100%");
            },
            hide: function() {
                $('#overlay').fadeOut();
                $("#overlay").on("hidden", function() {
                    $('.alert .close').off('click')
                    $('#alert_ok').off('click')
                    $('#alert_abt').off('click')
                    $("#overlay").remove();
                });
            }
        }
    }
    var bs_info = function(title, message, cb, ok, cancel) {
        var ret = '<div class="alert alert-info fade in transparent">';
        ret +=    '    <button data-dismiss="alert" class="close" type="button">×</button>';
        ret +=    '    <h4 class="alert-heading">'+title+'</h4>';
        ret +=    '    <p>'+message+'</p>';
        if (cb !== undefined) {
            if (!ok) ok = "Ok"
            if (!cancel) cancel = "Cancel"
            ret +=    '    <button id="alert_ok" href="#" data-dismiss="alert" class="btn btn-info">'+ok+'</button>'
            ret +=    '    <button id="alert_abt" href="#" data-dismiss="alert" class="btn">'+cancel+'</button>';
        }
        ret +=    '    </p>';
        ret +=    '</div>';
        $('#alert').html(ret);
        if (cb !== undefined) {
            $('#alert_ok').on('click', function() {$("#overlay").hide(); cb(true);});
            $('#alert_abt').on('click', function() {$("#overlay").hide(); cb(false);});
        }
        $('.alert .close').on('click', function() {$('#overlay').hide();});
        $('#overlay').fadeIn();
        $("#overlay").on("hidden", function() {
            $('.alert .close').off('click')
            $('#alert_ok').off('click')
            $('#alert_abt').off('click')
            $("#overlay").remove();
        });
    }
    var bs_alert = function(title, message, cb, ok, cancel) {
        var ret = '<div class="alert alert-error fade in">';
        ret +=    '    <button data-dismiss="alert" class="close" type="button">×</button>';
        ret +=    '    <h4 class="alert-heading">'+title+'</h4>';
        ret +=    '    <p>'+message+'</p>';
        if (cb !== undefined) {
            if (!ok) ok = "Ok"
            if (!cancel) cancel = "Cancel"
            ret +=    '    <a id="alert_ok" href="#" data-dismiss="overlay" class="btn btn-danger">'+ok+'</a>'
            ret +=    '    <a id="alert_abt" data-dismiss="overlay" href="#" class="btn">'+cancel+'</a>';
        }
        ret +=    '    </p>';
        ret +=    '</div>';
        $('#alert').html(ret);
        if (cb !== undefined) {
            $('#alert_ok').on('click', function() {$("#overlay").hide(); cb(true);});
            $('#alert_abt').on('click', function() {$("#overlay").hide(); cb(false);});
        }
        $('.alert .close').on('click', function() {$('#overlay').hide();});
        $('#overlay').fadeIn();
        $("#overlay").on("hidden", function() {
            $('.alert .close').off('click')
            $('#alert_ok').off('click')
            $('#alert_abt').off('click')
            $("#overlay").remove();
        });
    }

    ////////////////////////////////////////////////////////////////////////

    function check_block_pair(input) {
        if (!this.opened_parens) {
            this.opened_parens = {}
            this.opened_parens['{'] = input.split('{').length-1;
            this.opened_parens['}'] = input.split('}').length-1;
            this.opened_parens['['] = input.split('[').length-1;
            this.opened_parens[']'] = input.split(']').length-1;
            this.opened_parens['('] = input.split('(').length-1;
            this.opened_parens[')'] = input.split(')').length-1;
        } else {
            this.opened_parens['{'] += input.split('{').length-1;
            this.opened_parens['}'] += input.split('}').length-1;
            this.opened_parens['['] += input.split('[').length-1;
            this.opened_parens[']'] += input.split(']').length-1;
            this.opened_parens['('] += input.split('(').length-1;
            this.opened_parens[')'] += input.split(')').length-1;
        }
        if (this.opened_parens['{'] === this.opened_parens['}']
                && this.opened_parens['['] === this.opened_parens[']']
                && this.opened_parens['('] === this.opened_parens[')']) {
            this.opened_parens = undefined;
            return true;
        }
        return false;
    }

    // setup languages
    var languages = {
        javascript:   { greetings: "[[gb;#0f0;#000]REPL/Javascript interpreter:]", 
                        prompt: "js> ",
                        input_cb: function(input, term) {
                            if (input !== '') {
                                if (!check_block_pair(input)) {
                                    if (!this.script) {
                                        term.set_prompt("... ");
                                        this.script = [input];
                                    } else
                                        this.script.push(input);
                                } else {
                                    try {
                                        if (this.script) {
                                            this.script.push(input);
                                            this.YACE.jsrepl.eval(this.script.join("\n"));
                                            this.script = undefined;
                                            term.set_prompt("js> ")
                                        } else
                                            this.YACE.jsrepl.eval(input);
                                    } catch(e) {
                                        term.error(new String(e));
                                    }
                                }
                            } else {
                                term.echo('');
                            }
                        }
        },
        python:       { greetings: "[[gb;#0f0;#000]REPL/Python 2.7.2 (default, Sep 14 2011, 04:10:57) \n[GCC 4.2.1 (Based on Apple Inc. build 5658) (LLVM build)\\]",
                        prompt: ">>> ",
                        input_cb: function(input, term) {
                            try {
                                if (input !== '') {
                                    if (input.endsWith(":")) {
                                        if (!this.script) {
                                            this.nb_el = 0;
                                            this.script = [input];
                                            term.set_prompt("... ");
                                        } else {
                                            this.script.push(input);
                                        }
                                    } else if (this.script) {
                                        this.script.push(input);
                                    } else {
                                        try {
                                            this.YACE.jsrepl.eval(input);
                                            this.script = undefined;
                                        } catch(e) {
                                            term.error(new String(e));
                                        }
                                    }
                                } else { 
                                    term.echo('');
                                    this.nb_el = (this.nb_el + 1) % 2;
                                    if (this.nb_el === 1 && this.script) {
                                        term.set_prompt(">>> ");
                                        try {
                                            this.YACE.jsrepl.eval(this.script.join("\n"));
                                            this.script = undefined;
                                            this.nb_el = undefined;
                                        } catch(e) {
                                            term.error(new String(e));
                                        }
                                    }
                                }
                            } catch (e) {
                                console.error(e);
                                term.error(new String(e));
                            }
                        }
        },
        ruby:         { greetings: "[[gb;#0f0;#000]REPL/Ruby interpreter:]", 
                        prompt: "irb(main):0> ",
                        input_cb: function(input, term) {
                            if (input !== '') {
                                if (!this.in_block) {
                                    this.in_block = 0;
                                    this.script = [];
                                }
                                for (var i in input.match(/\b(def|if|while|for)\b/g))
                                    term.set_prompt("irb(main):"+(++this.in_block)+"> ");
                                for (var i in input.match(/\bend\b/g))
                                    term.set_prompt("irb(main):"+(--this.in_block)+"> ")
                                
                                if (this.in_block > 0) {
                                    this.script.push(input);
                                } else {
                                    if (this.script) {
                                        this.script.push(input);
                                        input = this.script.join("\n");
                                        this.script = undefined;
                                        this.in_block = undefined;
                                        term.set_prompt("irb(main):0> ")
                                    }
                                    try {
                                        this.YACE.jsrepl.eval(input);
                                    } catch(e) {
                                        term.error(new String(e));
                                    }
                                }
                            } else {
                                term.echo('');
                            }
                        },
                        result_cb: function(r) {
                            if (r !== "")
                                this.term.echo('[[gb;#0f0;#000]=>] '+r.trim("\n"))
                        }
        },
        lua:          { greetings: "[[gb;#0f0;#000]REPL/Lua interpreter:]", 
                        prompt: "lua> " },
        scheme:       { greetings: "[[gb;#0f0;#000]REPL/Scheme interpreter:]", 
                        prompt: "scheme> " },
        qbasic:       { greetings: "[[gb;#0f0;#000]REPL/QBasic interpreter:]", 
                        prompt: "QB> " },
        forth:        { greetings: "[[gb;#0f0;#000]REPL/Forth interpreter:]", 
                        prompt: "forth> " },
        emoticon:     { greetings: "[[gb;#0f0;#000]REPL/Emoticon interpreter:]", 
                        prompt: ":-> " },
        brainfuck:    { greetings: "[[gb;#0f0;#000]REPL/Brainfuck interpreter:]", 
                        prompt: "bf> " },
        lolcode:      { greetings: "[[gb;#0f0;#000]REPL/Lolcode interpreter:]", 
                        prompt: "lolcode> " },
        unlambda:     { greetings: "[[gb;#0f0;#000]REPL/Unlambda interpreter:]", 
                        prompt: "unlambda> " },
        bloop:        { greetings: "[[gb;#0f0;#000]REPL/Bloop interpreter:]", 
                        prompt: "bloop> " },
        traceur:      { greetings: "[[gb;#0f0;#000]REPL/Javascript.next interpreter:]", 
                        prompt: "es6> " },
        coffeescript: { greetings: "[[gb;#0f0;#000]REPL/Coffeescript interpreter:]", 
                        prompt: "coffee> " },
        move:         { greetings: "[[gb;#0f0;#000]REPL/Move interpreter:]", 
                        prompt: "move> " },
        kaffeine:     { greetings: "[[gb;#0f0;#000]REPL/Kaffeine interpreter:]", 
                        prompt: "kaffeine> " },
        roy:          { greetings: "[[gb;#0f0;#000]REPL/Roy interpreter:]", 
                        prompt: "roy> " },

    }

    // load interpreter
    function load_interpreter(lang) {
        if (window.YACE.jsrepl === undefined) {
            window.YACE.jsrepl = {};
            $('#jsrepl-script').attr('src', 'jsrepl/jsrepl.js');
            $.rloader([ {src:'jsrepl/jsrepl.js', async:false},
                        {event:'onready', func:load_interpreter,
                                            arg:lang} ]);
            return;
        }
        if (!lang.input_cb) lang.input_cb = function(command, term) {
            if (command !== '') {
                try {
                    this.YACE.jsrepl.eval(command);
                } catch(e) {
                    term.error(new String(e));
                }
            } else {
                term.echo('');
            }
        }
        if (!lang.result_cb)
            lang.result_cb = function(r) {
                if (r !== "")
                    this.YACE.term.echo('[[i;;]'+r.replace("]","\\]").trim("\n")+']')
            };
        if (!lang.output_cb)
            lang.output_cb = function(r) {
                if (r !== "") {
                    this.YACE.term.echo('[[;#0f0;#000]'+r.replace("]","\\]").trim("\n")+']')
                }
            };
        if (!lang.error_cb)
            lang.error_cb = function(r) {
                if (r !== "")
                    this.YACE.term.error(r)
            }

        var loaded = 1
        var pbar = bs_progress('REPL interpreter', 'loading '+lang.language+' interpreter', loaded);
        window.YACE.jsrepl = new JSREPL({
            progress: $.proxy(function () {pbar.update(++loaded*5)}),
            timeout: {
                time: 30000,
                callback: function () {
                    var ret = {done: false, value:undefined};
                    bs_alert('Interpreter timeout', 
                    'Execution is taking too long to respond, respawn?',
                    function(agreed) {
                        if (!agreed)
                            window.YACE.jsrepl.loadLanguage(lang.language, function () {  
                                pbar.done();
                                setTimeout(function() {pbar.hide()}, 1000);
                                window.YACE.term.fadeIn()
                            });
                    }, "Wait", "Respawn")
                    return true;
                }
            }
        });  
        try {
            window.YACE.jsrepl.loadLanguage(lang.language, function () {  
                pbar.done();
                setTimeout(function() {pbar.hide()}, 1000);
                window.YACE.term.fadeIn()
            });
            load_terminal(lang.input_cb, lang.prompt, lang.greetings);
            window.YACE.jsrepl.on('result', $.proxy(lang.result_cb, window))
            window.YACE.jsrepl.on('output', $.proxy(lang.output_cb, window))
            window.YACE.jsrepl.on('error', $.proxy(lang.error_cb, window))
        } catch (e) {
            // bs_alert('REPL Failure', e);
            console.error("REPL Failure: ", e)
            load_terminal();
        }
    }

    // load terminal
    function load_terminal() {
        var input_fun, prt, grts;
        if (window.YACE.term === undefined) {
            window.YACE.term = {};
            $.rloader([ {src:'terminal/jquery.mousewheel.js'},
                        {src:'terminal/jquery.terminal-0.6.3.js'},
                        {src:'terminal/jquery.terminal.css'},
                        {src:'terminal/jquery.terminal.css'},
                        {event:'onready', func:load_terminal,
                                        arg:arguments} ]);
            return;
        }
        if (arguments[0] && arguments[0][0] && arguments[0].length === 0) {
            prt = "js> "
            grts = '[[gb;#0f0;#000]Javascript interpreter:]'
            input_fun = function(command, term) {
                if (command !== '') {
                    try {
                        var result = window.eval(command);
                        if (result !== undefined)
                            term.echo(new String(result));
                    } catch(e) {
                            term.error(new String(e));
                    }
                } else {
                    term.echo('');
                }
            }
        } else {
            arguments = arguments[0]
            input_fun = arguments[0];
            prt = arguments[1];
            grts = arguments[2];
        }

        window.YACE.term = $('#preview').terminal(
                    $.proxy(input_fun, window), {
                    greetings: grts,
                    name: 'interpret',
                    prompt: prt
        });
        window.YACE.term.hide()
    }

    ////////////////////////////////////////////////////////////////////////

    var text_formats = {markdown : {load_list:[ {src:'markdown/showdown.js'},
                                                {src:'googlediff.js'},
                                                {src:'rangy-core.js'},
                                                {src:'jquery-ui.min.js'},
                                                {src:'to-markdown.js'},
                                                {src:'hallo.js'},
                                                {src:'hallo.css'},
                                                {src:'hallo-custom.css'},
                                                {src:'/font-awesome/css/font-awesome.css'},
                                                {src:'hallo/hallo-theme-raw.css'},
                                                {event:'onready', func:init_markdown} ]}}

    function init_markdown() {
        rangy.init();
        $('#run_script').hide()
        $('#run_select').hide()
        load_preview_menu();
        // showdown setting
        var converter = new Showdown.converter();
        // hallo setting
        this.preview = $('#preview').hallo({
            plugins: {
                //'halloindicator': {},
                'halloheadings': {},
                'halloformat': {},
                'halloblock': {},
                'hallojustify': {},
                'hallolists': {},
                //'hallolink': {},
                'halloreundo': {},
                // 'halloimage': {
                //     search: function(query, limit, offset, successCallback) {
                //         response = {offset: offset, total: limit + 1, assets: searchresult.slice(offset, offset+limit)};
                //         successCallback(response);
                //     },
                //     suggestions: null,
                //     uploadUrl: function() {
                //     return '/some/example/url'
                //     }
                // }
            },
            editable: true,
            toolbar: 'halloToolbarFixed'
        });
        var markdownize = function(content) {
            var html = content.split("\n").map($.trim).filter(function(line) {
                return line != "";
            }).join("\n");
            return toMarkdown(html);
        };
        var htmlize = function(content) {
            return converter.makeHtml(content);
        };
        var showSource = function(content) {
            var markdown = markdownize(content);
            if (window.YACE.doc.getText() == markdown) {
                return;
            }
            window.YACE.editor.getSession().getDocument().setValue(markdown);
        }; 
        var updateHtml = function(content) {
            if (markdownize($('#preview').html()) == content) {
                return;
            }
            var html = htmlize(content);
            $('#preview').html(html);
        };
        var skip_update = false;
        var hallomodified = function(event, data) {
            var dmp = new diff_match_patch();
            var edoc = window.YACE.editor.getSession().getDocument();
            var diffs = dmp.diff_main(window.YACE.doc.snapshot, markdownize(data.content));
            var pos = 0;
            for (var i in diffs) {
                var op = diffs[i][0];
                var st = diffs[i][1];
                if (op === 0) {
                    pos += st.length;
                } else if (op === 1) {
                    pos += st.length;
                    skip_update = true;
                    if (st === "\n\n") {
                        edoc.insert(edoc.indexToPosition(pos-2), st);
                    } else
                        edoc.insert(edoc.indexToPosition(pos-1), st);
                    skip_update = false;
                } else if (op === -1) {
                    var start = edoc.indexToPosition(pos);
                    var end = edoc.indexToPosition(pos+st.length);
                    var range = ace.require('ace/range').Range.fromPoints(start, end)
                    skip_update = true;
                    edoc.remove(range);
                    skip_update = false;
                }

            }
            event.preventDefault()
        };
        $('#preview').bind('hallomodified', hallomodified);
        $('#editor').on('change', function(event, data) {
            updateHtml(window.YACE.doc.snapshot);
            event.preventDefault()
        });
        window.YACE.doc.on('change', function(op) {
            console.warn(op);
            if (!skip_update) {
                updateHtml(window.YACE.doc.snapshot);
            }
        });
        updateHtml(window.YACE.doc.snapshot);

        if ($.cookie('yace.preview.ro') === 'true') {
            $('#preview').attr('contenteditable', false);
            $('#prev_ro').addClass('dropdown-selected');
        }
    }

    ////////////////////////////////////////////////////////////////////////

    var themes = [
        "ambiance",
        "chaos",
        "chrome",
        "clouds",
        "clouds_midnight",
        "cobalt",
        "crimson_editor",
        "dawn",
        "dreamweaver",
        "eclipse",
        "github",
        "idle_fingers",
        "kr",
        "merbivore",
        "merbivore_soft",
        "mono_industrial",
        "monokai",
        "pastel_on_dark",
        "solarized_dark",
        "solarized_light",
        "terminal",
        "textmate",
        "tomorrow",
        "tomorrow_night_blue",
        "tomorrow_night_bright",
        "tomorrow_night_eighties",
        "tomorrow_night",
        "twilight",
        "vibrant_ink",
        "xcode"
    ];

    ////////////////////////////////////////////////////////////////////////

    function load_themes_menu(params) {
        for (var theme in themes) {
            theme = themes[theme];
            var selected = "";
            if (theme === params.theme) {
                selected = 'class="dropdown-selected"'
            }
            $('#dd-theme').append('<li role="presentation">'
                                    + '<a id="'+theme+'" '+selected+' href="#" tabindex="-1" role="menuitem">'
                                    + theme 
                                    + '</a> </li>');
        }
        $('ul#dd-theme li a').click(function (e) {
            window.YACE.editor.setTheme("ace/theme/"+$(this).attr('id'));
            $('#dd-theme li a').removeClass('dropdown-selected')
            $(this).addClass('dropdown-selected');
            $.cookie('yace.ace.theme', $(this).attr('id'));
            e.preventDefault();
            return false;
        });
    }
    function load_filetype_menu(params) {
        var selected = "";
        if ('markdown' === params.format)
            selected = 'class="dropdown-selected"'
        $('#dd-filetype').append('<li role="presentation">'
                                + '<a id="markdown" '+selected+' href="#" tabindex="-1" role="menuitem">'
                                + 'Markdown'
                                + '</a> </li>')
        $('#dd-filetype').append('<li class="divider" role="presentation"></li>')

        for (var lang in Object.keys(languages)) {
            lang = Object.keys(languages)[lang];
            var selected = "";
            if (lang === params.format)
                selected = 'class="dropdown-selected"'
            $('#dd-filetype').append('<li role="presentation">'
                                    + '<a id="'+lang+'" '+selected+' href="#" tabindex="-1" role="menuitem">'
                                    + lang 
                                    + '</a> </li>');
        }
        $('ul#dd-filetype li a').click(function (e) {
            params['format'] = $(this).attr('id')
            var search = Object.keys(params).map(function(k) { return k+"="+params[k] }, params ).join("&")
            window.location.replace("/?" + search)
            $.cookie('yace.filetype', $(this).attr('id'));
            e.preventDefault();
            return false;
        });
    }
    function load_export_menu(params) {
        // disable the whole menu
        $('#dd-export li a').addClass('disabled-link');
        $('#pdf').removeClass('disabled-link')
        $('#pdf').click(function () {
            var doc = new jsPDF();

            // We'll make our own renderer to skip this editor
            var specialElementHandlers = {
                '#preview': function(element, renderer){
                    return false;
                },
                '#editor': function(element, renderer){
                    return true;
                },
                '#overlay': function(element, renderer){
                    return true;
                },
                '#modal': function(element, renderer){
                    return true;
                },
                '#header': function(element, renderer){
                    return true;
                },
                '#footer': function(element, renderer){
                    return true;
                },
                '.hallotoolbar': function(element, renderer){
                    return true;
                },
            };

            // All units are in the set measurement for the document
            // This can be changed to "pt" (points), "mm" (Default), "cm", "in"
            doc.fromHTML($('body').get(0), 15, 15, {
                'width': 170, 
                'elementHandlers': specialElementHandlers
            });
			doc.save(params.text + '.pdf');
        });
        $('#raw').removeClass('disabled-link')
        $("#raw").click(function () {
            var blob = new Blob(window.YACE.doc.snapshot.split("\n"), {
                type: "text/plain;charset=utf-8;",
            });
            saveAs(blob, params.text+".md");
        });
        $('#html').removeClass('disabled-link')
        $("#html").click(function () {
            // showdown setting
            var converter = new Showdown.converter();
            var blob = new Blob(converter.makeHtml(window.YACE.doc.snapshot).split("\n"), {
                type: "text/plain;charset=utf-8;",
            });
            saveAs(blob, params.text+".html");
        });
        // $('#gist').removeClass('disabled-link')
        $("#gist").click(function () {
            var gist = {
                "description": "Gist from http://yace.m0g.net/?text="+params.text,
                "public": true,
                "files": {}
            }
            gist.files[params.text] = window.YACE.doc.snapshot;
            $.ajax({
                url: 'https://api.github.com/gists',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(gist)
            })
            .success( function(e) {
                bs_info("Exported as Gist", "Document is now exported to "+e.html_url);
            })
            .error( function(e) {
                console.error("gist save error", e);
                bs_alert("Failure of Gist export", "Document couldn't be exported to gist.github.com:<br/>"+e.responseJSON.message);
            });
        });
    }

    function load_vim_kbd() {
        ace.require("ace/lib/net").loadScript("/ace/keybinding-vim.js",
        function() {
            $.cookie('yace.ace.input_mode', 'vim');
            window.YACE.editor.setKeyboardHandler(ace.require("ace/keyboard/vim").handler); 
        });
        $('#ace_kbd_vim').addClass('dropdown-selected');
        $('#ace_kbd_emacs').removeClass('dropdown-selected');
        $('#ace_kbd_default').removeClass('dropdown-selected');
    }
    function load_emacs_kbd() {
        ace.require("ace/lib/net").loadScript("/ace/keybinding-emacs.js",
        function() {
            $.cookie('yace.ace.input_mode', 'emacs');
            window.YACE.editor.setKeyboardHandler(ace.require("ace/keyboard/emacs").handler); 
        });
        $('#ace_kbd_vim').removeClass('dropdown-selected');
        $('#ace_kbd_emacs').addClass('dropdown-selected');
        $('#ace_kbd_default').removeClass('dropdown-selected');
    }
    function load_default_kbd() {
        window.YACE.editor.setKeyboardHandler();
        $.cookie('yace.ace.input_mode', 'default');
        $('#ace_kbd_vim').removeClass('dropdown-selected');
        $('#ace_kbd_emacs').removeClass('dropdown-selected');
        $('#ace_kbd_default').addClass('dropdown-selected');
    }
    function load_editor_menu(params) {
        // set up wrap lines
        $('#ace_wrap').click(function (e) {
            var wrap = window.YACE.editor.getSession().getUseWrapMode();
            window.YACE.editor.getSession().setUseWrapMode(!wrap);
            if (!wrap) {
                $.cookie('yace.ace.wrap', 'true');
                $('#ace_wrap').addClass('dropdown-selected');
            } else {
                $.cookie('yace.ace.wrap', 'false');
                $('#ace_wrap').removeClass('dropdown-selected');
            }
            e.preventDefault();
        });
        // set up toggle lines
        $('#ace_lines').addClass('dropdown-selected');
        $('#ace_lines').click(function (e) {
            var gutter = window.YACE.editor.renderer.getShowGutter();
            window.YACE.editor.renderer.setShowGutter(!gutter);
            if (!gutter) {
                $.cookie('yace.ace.gutter', 'true');
                $('#ace_lines').addClass('dropdown-selected');
            } else {
                $.cookie('yace.ace.gutter', 'false');
                $('#ace_lines').removeClass('dropdown-selected');
            }
            e.preventDefault();
        });
        // set up invisibles
        $('#ace_invis').click(function (e) {
            var invisibles = window.YACE.editor.renderer.getShowInvisibles();
            if (!invisibles) {
                $.cookie('yace.ace.show_invisible', 'true');
                $('#ace_invis').addClass('dropdown-selected');
            } else {
                $.cookie('yace.ace.show_invisible', 'false');
                $('#ace_invis').removeClass('dropdown-selected');
            }
            e.preventDefault();
        });
        // set up keyboard shortcuts for ACE
        $('#ace_kbd_default').addClass('dropdown-selected');
        $('#ace_kbd_vim').click(load_vim_kbd);
        $('#ace_kbd_emacs').click(load_emacs_kbd);
        $('#ace_kbd_default').click(load_default_kbd);

        // set up the show dropdown submenu
        $('#show_both').click(function (e) {
            show_both();
            e.preventDefault();
        });
        $('#show_editor').click(function (e) {
            show_editor();
            e.preventDefault();
        });
        $('#show_preview').click(function (e) {
            show_preview();
            e.preventDefault();
        });

    }
    function show_editor() {
        $('#preview').hide();
        $('#editor')
        $('#editor').css('width', '100%').resize().show();
        $('#show_both').removeClass('dropdown-selected');
        $('#show_editor').addClass('dropdown-selected');
        $('#show_preview').removeClass('dropdown-selected');
        $.cookie('yace.ui.show', 'editor');
    }
    function show_preview() {
        $('#editor').hide()
        $('#preview').css({'width': '100%', 'left': '0'})
                        .resize()
                        .show();
        $('#show_both').removeClass('dropdown-selected');
        $('#show_editor').removeClass('dropdown-selected');
        $('#show_preview').addClass('dropdown-selected');
        $.cookie('yace.ui.show', 'preview');
    }
    function show_both() {
        $('#editor').css({'width': '50%'})
                    .resize()
                    .show();
        $('#preview').css({'width': '50%', 'left': '50%'})
                        .resize()
                        .show();
        $('#show_both').addClass('dropdown-selected');
        $('#show_editor').removeClass('dropdown-selected');
        $('#show_preview').removeClass('dropdown-selected');
        $.cookie('yace.ui.show', 'both');
    }

    function load_preview_menu() {
        $('#dd-prev-theme').removeClass('disabled-link');
        $('#prev_ro').removeClass('disabled-link')
        // set up preview read only
        $('#prev_ro').click(function (e) {
            var ro = $('#preview').attr('contenteditable') === "false";
            $('#preview').attr('contenteditable', ro);
            if (!ro) {
                $('#prev_ro').addClass('dropdown-selected');
                $.cookie('yace.preview.ro', 'true');
            } else {
                $('#prev_ro').removeClass('dropdown-selected');
                $.cookie('yace.preview.ro', 'false');
            }
            e.preventDefault();
        });

        // set up preview theme submenu
        var preview_themes = ['awesome', 'raw', 'white-on-black'];
        var current = $.cookie('yace.preview.theme');
        if (current === undefined)
            current = "raw";
        for (var theme in preview_themes) {
            theme = preview_themes[theme];
            var selected = "";
            if (theme === current) {
                $("link[href^='hallo/hallo-theme']").attr('href', 'hallo/hallo-theme-'+theme+'.css')
                selected = 'class="dropdown-selected"'
            }
            $('#dd-prev-theme').append('<li role="presentation">'
                                        + '<a id="'+theme+'" '+selected+' href="#" tabindex="-1" role="menuitem">'
                                        + theme 
                                        + '</a> </li>');
        }
        // disable the whole submenu
        $('ul#dd-prev-theme li a').click(function (e) {
            $("link[href^='hallo/hallo-theme']").attr('href', 'hallo/hallo-theme-'+$(this).attr('id')+'.css')
            $('#dd-prev-theme li a').removeClass('dropdown-selected')
            $(this).addClass('dropdown-selected');
            $.cookie('yace.preview.theme', $(this).attr('id'));
            e.preventDefault();
            return false;
        });
    }
    function load_modals(params) {
        $('#rtfm_about').click(function (e) {
            // set up RTFM about box
            bs_modals("About YACE",
                '<p>YACE stands for "Yet Another Collaborative Editor". '
            + 'Based on `Share.js`,<br />'
            + 'it features all modern concepts of online edition:</p>'
            + '<ul>'
            + '    <li>collaborative edition</li>'
            + '    <li>text editor, and wysiwyg text edition</li>'
            + '    <li>for programming languages, use the language REPL</li>'
            + '</ul>'
            + ''
            + '<h2>Copyleft</h2>'
            + ''
            + '<p>This has been hacked by <a href="http://b.pratz.net">me</a>!</p>'
            + ''
            + '<h2>Dependencies</h2>'
            + ''
            + '<ul>'
            + '    <li>node.js</li><li>share.js</li><li>connect</li>'
            + '    <li>browserchannel</li><li>redis</li><li>showdown</li>'
            + '    <li>twitter-bootstrap</li><li>rangy-browser</li>'
            + '    <li>googlediff</li><li>hallo.js</li><li>jquery</li>'
            + '</ul>'
            + ''
            + '<h2>License</h2>'
            + ''
            + '<a>Under the AGPLv3</a>');
            e.preventDefault();
        });
        $('#rtfm_help').click(function (e) {
            // set up RTFM help box TODO
            bs_modals("Help", "<p>Help, I need somebody<br />"
                            + "Help, not just anybody<br />"
                            + "Help, you know I need someone, help<br />"
                            + "</p><p>"
                            + "When I was younger so much younger than today<br />"
                            + "I never needed anybody's help in any way<br />"
                            + "But now these days are gone, I'm not so self assured<br />"
                            + "Now I find I've changed my mind and opened up the doors<br />"
                            + "</p><p>"
                            + "Help me if you can, I'm feeling down<br />"
                            + "And I do appreciate you being round<br />"
                            + "Help me get my feet back on the ground<br />"
                            + "Won't you please, please help me<br />"
                            + "</p><p>"
                            + "And now my life has changed in oh so many ways<br />"
                            + "My independence seems to vanish in the haze<br />"
                            + "But every now and then I feel so insecure<br />"
                            + "I know that I just need you like I've never done before<br />"
                            + "</p><p>The Beatles</p>");

            e.preventDefault();
        });
    }

    function init_yace() {
        $('#overlay').hide();

        // build the parameters
        var defaults = {format:'markdown'};
        if ($.cookie('yace.filetype') !== undefined)
            defaults.format = $.cookie('yace.filetype');
        if ($.cookie('yace.ui.show') === "both")
            show_both();
        else if ($.cookie('yace.ui.show') === "preview")
            show_preview();
        else if ($.cookie('yace.ui.show') === "editor")
            show_editor();

        var params = (function(params) {
            params = params.replace('?','').split('&').map(function (elt,idx,lst) { return elt.split('=')} );
            params.forEach(function(param) {
                defaults[param[0]] = param[1];
            });
            return defaults;
        }(window.location.search));

        $('#dd-prev-theme').addClass('disabled-link');
        $('#prev_ro').addClass('disabled-link')

        return params;
    }
    function init_editor(params) {
        // init the textarea element 
        window.YACE.editor = ace.edit("editor");
        window.YACE.editor.setReadOnly(true);
        window.YACE.editor.setShowPrintMargin(false);
        if ($.cookie('yace.ace.input_mode') === 'vim')
            load_vim_kbd();
        else if ($.cookie('yace.ace.input_mode') === 'emacs')
            load_emacs_kbd();
        else
            load_default_kbd();
            
        if ($.cookie('yace.ace.show_invisible') === 'true') {
            window.YACE.editor.renderer.setShowInvisibles(true)
            $('#ace_invis').addClass('dropdown-selected');
        }
        if ($.cookie('yace.ace.gutter') === 'true'){ 
            window.YACE.editor.renderer.setShowGutter(true);
            $('#ace_lines').addClass('dropdown-selected');
        }
        if ($.cookie('yace.ace.wrap') === 'true') {
            window.YACE.editor.getSession().setUseWrapMode(true);
            $('#ace_wrap').addClass('dropdown-selected');
        }
        var theme;
        if (params.theme !== undefined) {
            $.cookie('yace.ace.theme', params.theme);
            theme = params.theme;
        } else if ($.cookie('yace.ace.theme') !== undefined)
            theme = $.cookie('yace.ace.theme');
        if (theme)
            window.YACE.editor.setTheme("ace/theme/"+theme);

        window.YACE.editor.getSelectedText = function() {
            return this.session.getTextRange(this.getSelectionRange())
        } 

        window.YACE.editor.getSession().selection.on('changeSelection', function(e, s) {
            if (window.YACE.editor.getSelectedText().length === 0) {
                $('#run_select').prop('disabled', true);
            } else {
                $('#run_select').prop('disabled', false);
            }
            e.preventDefault();
        });
    }

    // load at startup
    window.YACE = function() {
        try {
            var params = init_yace();

            if (!params.hasOwnProperty('text')) {
                var frtpg = '<div class="masthead">'
                          + '    <div class="jumbotron">'
                          + '        <h1>YACE</h1>'
                          + '        <p class="lead">Yet Another Collaborative Editor!</p>'
                          + '        <input id="text" class="" type="text" value="Name of a document"></input><br/>'
                          + '        <a id="load" class="btn btn-success" href="#">Create or load a document</a>';
                          + '    </div>';
                          + '</div>';
                $("header").html(frtpg);
                $("section").remove();
                var entered = false;
                $("#text").click(function (e) {
                    $("#text").val("");
                    $("#text").off('click');
                    entered = true;
                    e.preventDefault();
                });
                $("#text").keyup(function (e) {
                    if (e.keyCode == 13)
                        $("#load").click();
                    e.preventDefault();
                });
                $("#load").click(function (e) {
                    if ($("#text").val() !== "" && entered) {
                        window.location.replace("/?text=" +$("#text").val());
                    } else {
                        var uid = Math.random().toString(36).substring(7);
                        window.location.replace("/?text=" +uid);
                    }
                    e.preventDefault();
                });
                return;
            }

            // populate UI
            load_filetype_menu(params);
            load_export_menu(params);
            load_themes_menu(params);
            load_editor_menu(params);
            load_modals(params);

            init_editor(params);

            // connect to the server
            var connection = sharejs.open(params.text, 'text', function(error, doc) {
                // this function is called once the connection is opened
                if (error) {
                    console.error(error);
                    bs_alert("Yace Init","Error initiating collaborative editor: "+error);
                } else {
                    // attach the ShareJS document to the textarea
                    doc.attach_ace(window.YACE.editor);
                    window.YACE.editor.setReadOnly(false);
                    if (languages.hasOwnProperty(params.format)) {
                        languages[params.format].language = params.format;
                        try {
                            load_interpreter(languages[params.format])
                        } catch(e) {
                            console.error(e)
                        }
                        $('#filetype').val(params.format);
                        $('#run_script').on('click', function() {
                            window.YACE.term.focus();
                            window.YACE.term.echo("[[gb;#0f0;#000]Executing script:]");
                            window.YACE.term.exec(window.YACE.doc.snapshot);
                        });
                        $('#run_select').on('click', function() {
                            window.YACE.term.focus();
                            window.YACE.term.echo("[[gb;#0f0;#000]Executing script:]");
                            window.YACE.term.exec(window.YACE.editor.getSelectedText());
                        });
                    } else if (text_formats.hasOwnProperty(params.format)) {
                        try {
                            $.rloader(text_formats[params.format].load_list);
                        } catch (e) { console.error(e); }

                    } else {
                        bs_alert("unknown filetype "+params.format);
                    }
                    window.YACE.doc = doc;
                }
            });
        } catch (e) {
            console.error(e);
        }
        $(".disabled-link").click(function(event) {
            event.preventDefault();
        });
    }
}());
