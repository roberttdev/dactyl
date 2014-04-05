dc.ui.SubtemplateListing = Backbone.View.extend({
    events: {
        'click #subtemplate_edit'  :   'openEditWindow',
        'click #subtemplate_delete':   'confirmDelete'
    },

    initialize: function() {
        _.bindAll(this, 'openEditWindow', 'confirmDelete', 'deleteSubtemplate');
        this.model.on('change', this.updateView, this);
        this.model.on('destroy', this.deleteView, this);
    },


    render: function(options) {
        this.$el.html(JST['template/subtemplate_listing']({
            name: this.model.get('sub_name')
        }));
        return this;
    },


    updateView: function(options) {
       this.$('.title').html(this.model.get('sub_name'));
    },


    deleteView: function(options) {
        this.$el.remove();
        this.$el = $();
    },


    //Opens editing window.  Template ID to edit is passed in event data ('template_id').
    openEditWindow: function(event) {
        dc.ui.SubtemplateDataDialog.open(this.model);
    },


    //Show popup confirming template delete
    confirmDelete: function(event) {
        dc.ui.Dialog.confirm('Are you sure you want to delete this subtemplate?', this.deleteSubtemplate);
    },


    //Actual delete of template
    deleteSubtemplate: function(subtemplate) {
        this.model.destroy();
        return true;
    }

})