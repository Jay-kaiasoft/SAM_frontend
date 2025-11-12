CKEDITOR.plugins.add("mergepropertieslabel", {
    init: function(a) {
        a.ui.addButton("mergePropertiesLabel", {
            label: "Properties",
            title: "Properties",
            command: 'mergePropertiesLabel',
        });
        a.addCommand( 'mergePropertiesLabel', {
            exec: function( b ) {
				$(".dsmbsettingbutton i").removeClass("tpl-specific-active");
    			$(".dsmbsettingbutton").find(".tpl-block-move-up,.tpl-block-move-down,.tpl-block-clone,.tpl-block-delete").show();
                $(".dsmbsettingbutton").find(".tpl-block-clone,.tpl-block-delete").hide();
				$("#draggable-setting-menu").show();
            }
        });
    }
});