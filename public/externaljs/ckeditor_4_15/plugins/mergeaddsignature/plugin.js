CKEDITOR.plugins.add("mergeaddsignature", {
    requires: ["richcombo"],
    init: function(a) {
		let signaturestags=a.config.signature;
		let id = a.element.$.id;
        a.ui.addRichCombo("mergeAddSignature", {
            label: "Signatures",
            title: "Signatures",
            voiceLabel: "Signatures",
            className: "cke_format",
            multiSelect: !1,
            panel: {
                css: [CKEDITOR.skin.getPath("editor")].concat(a.config.contentsCss)
            },
            init: function() {
                let b = this;
				for (let this_tag in signaturestags){
					b.add(signaturestags[this_tag][1], signaturestags[this_tag][1]);
				}
                b.add("Add Signature", '+ Add Signature');
				b._.list.commit()
            },
            onClick: function(e) {
                if (e === "Add Signature") {
                    $(".cke").hide();
                    $("#clickAddSignature").trigger("click");
                } else {
                    let selectedSignature = signaturestags.find(tag => tag[1] === e);
                    const markerId = 'cursor-marker-' + Date.now();
                    const ae = '<div>' + selectedSignature?.[0]?.replaceAll('\n', '<br>') + `<span id="${markerId}">&nbsp;</span></div>`;
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
                    $("#" + id).html(a.element.$.innerHTML);
                }
            }
        });
    }
});