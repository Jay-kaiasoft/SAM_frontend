
CKEDITOR.plugins.add("mergeudfs", {
    requires: ["richcombo"],
    init: function(a) {
        CKEDITOR.mergeUDFS.addExternal("merges", a.config.mergeUDFS);
        a.ui.addRichCombo("Mergeudfs", {
            label: "Fields",
            title: "Fields",
            voiceLabel: "Fields",
            className: "cke_format",
            multiSelect: !1,
            panel: {
                css: [CKEDITOR.skin.getPath("editor")].concat(a.config.contentsCss)
            },
            init: function() {
                var a = this;
                CKEDITOR.mergeUDFS.load("merges", function(d) {
                    d = d.merges;
//                    a.add("cheatsheet", "Open Cheatsheet", "Open Cheatsheet");
                    for (var this_tag in tags){
	                  a.add(tags[this_tag][0], tags[this_tag][1], tags[this_tag][2]);
	               }
                    /*for (var b in d)
                        if (b && !("name" == b || "path" == b)) {
                            a.startGroup(b);
                            var f = d[b],
                                c;
                            for (c in f) c && a.add(f[c], c, c)
                        }*/
                    a._.list.commit()
                })
            },
            onClick: function(e) {
            	
            	
            	
                "cheatsheet" == e ? window.open("all-the-merge-tags-cheatsheet", "_blank") : (a.focus(), a.fire("saveSnapshot"), a.insertHtml(e), a.fire("saveSnapshot"));
				var name = " edtfild=editorfield"+edful;
			    var ca = document.cookie.split(';');
			        if (ca.indexOf(name) < 0) {
						if(!$('#display_tooltips').hasClass('in')){
							$('#display_tooltips').modal('show');
						}
			        }
                this._.value = ""
            }
        })
    }
});
CKEDITOR.mergeUDFS = new CKEDITOR.resourceManager("", "mergeUDFS");