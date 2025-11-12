CKEDITOR.plugins.add("mergetextai", {
    init: function(a) {
        let id = a.element.$.id;
        a.ui.addButton("mergeTextAi", {
            label: "AI",
            title: "Content With AI Assistant",
            command: 'mergeTextAi',
        });
        a.addCommand( 'mergeTextAi', {
            exec: function( b ) {
                window.setOpenAiButton(id);
            }
        });
    }
});