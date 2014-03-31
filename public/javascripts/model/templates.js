//****************
// Template Model
//****************
dc.model.Template = Backbone.Model.extend({
    urlRoot: '/templates',
    template_fields: null,
    base_fetch_complete: false,
    fields_fetch_complete: false,


    initialize: function(){
      //Init blank field collection
      this.template_fields = new dc.model.TemplateFields();
      this.updateFieldsURL();

      //Make sure collection URL is always updated on ID change
      this.on('change:id', this.updateFieldsURL, this);
    },


    validate: function(attrs) {
        errors = [];

        //Check for empty template name
        if( attrs.name == null || attrs.name.length == 0 ){
            errors.push({
                message: _.t('template_name_required'),
                class: 'name'
            });
        }

        if(errors.length){ return errors; }
    },


    //Fetches base model and sub-models, then calls passed-in success function when done
    fetchAll: function(successFunction){
        _thisModel = this;
        $.when(this.fetch()).done(function() {
            $.when(_thisModel.template_fields.fetch().done(successFunction));
        });
    },


    //Save fields; on success, save template
    saveAll: function(successFunction) {
        _thisModel = this;

        //If template fields exist, push those first; otherwise just push this
        if(_thisModel.template_fields != null && _thisModel.template_fields.length > 0){
            _thisModel.template_fields.pushAll({
                success: function(){
                    _thisModel.save({},{success: successFunction});
                }}, {
                error: function(){
                    alert('Error communicating with server on save!');
            }});
        }else{
            _thisModel.save({},{success: successFunction});
        }

    },


    //Updates fields collection URL
    updateFieldsURL: function() {
       this.template_fields.url = this.url() + '/template_fields/';
    }
});


//*********************
// Template Collection
//*********************
dc.model.Templates = Backbone.Collection.extend({
    model : dc.model.Template,
    url: '/templates/index.json'

});


//**********************
// Template Field Model
//**********************
dc.model.TemplateField = Backbone.Model.extend({
});


//*********************
// Template Field Collection
//*********************
dc.model.TemplateFields = Backbone.BulkSubmitCollection.extend({
    model : dc.model.TemplateField
});


