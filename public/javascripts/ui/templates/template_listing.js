dc.ui.TemplateListing = Backbone.View.extend({
    events: {
        'click #new_subtemplate':   'sendNewSubtemplateRequest',
        'click #template_edit'  :   'openEditWindow',
        'click #template_delete':   'confirmDelete'
    },

    initialize: function() {
        _.bindAll(this, 'openEditWindow', 'confirmDelete', 'deleteTemplate', 'sendNewSubtemplateRequest', 'addNewSubtemplate');
        this.model.on('change', this.updateView, this);
        this.model.on('destroy', this.deleteView, this);
    },


    render: function(options) {
        _thisView = this;

        //Render this template
        _thisView.$el.html(JST['template/template_listing']({
            name: _thisView.model.get('name')
        }));

        //Render subtemplates
        $.each(_thisView.model.subtemplates.models, function(index, subtemplate){
           _thisView.showSubtemplate(subtemplate);
        });
        return _thisView;
    },


    showSubtemplate: function(model) {
        _subView = new dc.ui.SubtemplateListing({model: model});
        _subView.render();
        this.$('.subtemplate_container').append(_subView.$el);
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
    },


    //Add new subtemplate to view
    addNewSubtemplate: function(subtemplate) {
        this.model.subtemplates.add(subtemplate);
        this.showSubtemplate(subtemplate);

    },


    //Send notification for new subtemplate request, along with data about which template it is
    sendNewSubtemplateRequest: function() {
        this.trigger('newSubtemplateRequest', this.model.get('id'));
    }
})