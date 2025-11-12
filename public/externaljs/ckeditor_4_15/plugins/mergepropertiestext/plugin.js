CKEDITOR.plugins.add("mergepropertiestext", {
    init: function(a) {
        a.ui.addButton("mergePropertiesText", {
            label: "Properties",
            title: "Properties",
            command: 'mergePropertiesText',
        });
        a.addCommand( 'mergePropertiesText', {
            exec: function( b ) {
				$(".dsmbsettingbutton i").removeClass("tpl-specific-active");
    			$(".dsmbsettingbutton").find(".tpl-block-move-up,.tpl-block-move-down,.tpl-block-clone,.tpl-block-delete").show();
				$("#draggable-setting-menu").show();
            }
        });
    }
});