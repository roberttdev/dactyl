dc.ui.TemplateListing = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'renderWithEvents', 'openEditWindow', 'confirmDelete', 'deleteTemplate');
        this.model.on('change', this.updateView, this);
        this.model.on('destroy', this.deleteView, this);
    },

    render: function(options) {
        this.$el = $(JST['template/template_listing']({
            name: this.model.get('name')
        }));
        return this;
    },


    renderWithEvents: function(options) {
        this.render(options);
        this.$('#template_edit').on('click', {}, this.openEditWindow);
        this.$('#template_delete').on('click', {}, this.confirmDelete);
    },


    updateView: function(options) {
       this.$('.title').html(this.model.get('name'));
    },


    deleteView: function(options) {
        this.$el.remove();
        this.$el = $();
    },


    //Opens editing window.  Template ID to edit is passed in event data ('template_id').
    openEditWindow: function(event) {
        dc.ui.TemplateDataDialog.open(this.model);
    },


    //Show popup confirming template delete
    confirmDelete: function(event) {
        dc.ui.Dialog.confirm('Are you sure you want to delete this template?', this.deleteTemplate);
    },


    //Actual delete of template
    deleteTemplate: function(template) {
        this.model.destroy();
        return true;
    }
})