dc.ui.TemplateListing = Backbone.View.extend({
    initialize: function() {
        this.model.on('change', this.updateView, this);
    },

    render: function(options) {
        this.$el = $(JST['template/template_listing']({
            name: this.model.get('name')
        }));
        return this;
    },


    updateView: function(options) {
       this.$('.title').html(this.model.get('name'));
    }
})