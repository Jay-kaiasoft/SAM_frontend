CKEDITOR.plugins.add("mergeudfs", {
    requires: ["richcombo"],
    init: function(a) {
        let tags=a.config.tags;
        let id = a.element.$.id;
        a.ui.addRichCombo("Mergeudfs", {
            label: "Contact Fields",
            title: "Contact Fields",
            voiceLabel: "Contact Fields",
            className: "cke_format",
            multiSelect: !1,
            panel: {
                css: [CKEDITOR.skin.getPath("editor")].concat(a.config.contentsCss)
            },
            init: function() {
                let b = this;
                for (let this_tag in tags){
	                  b.add('<span class="notranslate">##'+tags[this_tag][1].replaceAll(" ", "_")+'##</span>', tags[this_tag][1], tags[this_tag][2]);
	               }
                    b._.list.commit()
            },
            onClick: function(e) {
                const markerId = 'cursor-marker-' + Date.now();
                const ae = e + `<span id="${markerId}">&nbsp;</span>&nbsp;`;
                a.focus();
                a.insertHtml(ae);
                setTimeout(() => {
                    const markerElement = a.document.getById(markerId);
                    if (markerElement) {
                        const range = a.createRange();
                        range.moveToPosition(markerElement, CKEDITOR.POSITION_AFTER_END);
                        const sel = a.getSelection();
                        sel.selectRanges([range]);
                        markerElement.remove();
                    }
                }, 0);
                // $("#" + id).html(a.element.$.innerHTML);
            }
        })
    }
});