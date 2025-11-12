CKEDITOR.plugins.add("mergepropertiesfooter", {
    init: function(a) {
        a.ui.addButton("mergePropertiesFooter", {
            label: "Properties",
            title: "Properties",
            command: 'mergePropertiesFooter',
        });
        a.addCommand( 'mergePropertiesFooter', {
            exec: function( b ) {
				$(".dsmbsettingbutton i").removeClass("tpl-specific-active");
    			$(".dsmbsettingbutton").find(".tpl-block-move-up,.tpl-block-move-down,.tpl-block-clone,.tpl-block-delete").show();
                $(".dsmbsettingbutton").find(".tpl-block-move-up,.tpl-block-move-down,.tpl-block-clone").hide();
				$("#draggable-setting-menu").show();
            }
        });
    }
});