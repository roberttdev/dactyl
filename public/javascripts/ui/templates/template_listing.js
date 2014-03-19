dc.ui.TemplateListing = Backbone.View.extend({
    render: function(options) {
        this.$el = $(JST['template/template_listing']({
            name: this.model.get('name')
        }));
        return this;
    }
})