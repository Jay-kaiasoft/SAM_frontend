CKEDITOR.plugins.add("mergepropertiesheader", {
    init: function(a) {
        a.ui.addButton("mergePropertiesHeader", {
            label: "Properties",
            title: "Properties",
            command: 'mergePropertiesHeader',
        });
        a.addCommand( 'mergePropertiesHeader', {
            exec: function( b ) {
				$(".dsmbsettingbutton i").removeClass("tpl-specific-active");
    			$(".dsmbsettingbutton").find(".tpl-block-move-up,.tpl-block-move-down,.tpl-block-clone,.tpl-block-delete").show();
                $(".dsmbsettingbutton").find(".tpl-block-move-up,.tpl-block-move-down,.tpl-block-clone").hide();
                if($("#headerdimg img").hasClass("mcnImage")) {
                    $(".dsmbsettingbutton i.tpl-specific-i").addClass("tpl-specific-active");
                }
				$("#draggable-setting-menu").show();
            }
        });
    }
});