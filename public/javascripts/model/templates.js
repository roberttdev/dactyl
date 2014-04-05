//****************
// Template Model
//****************
dc.model.Template = Backbone.Model.extend({
    urlRoot: '/templates',
    template_fields: null,
    subtemplates: null,
    base_fetch_complete: false,
    fields_fetch_complete: false,


    constructor: function(attributes, options) {
        attributes = typeof attributes !== 'undefined' ? attributes : {};
        this.template_fields = new dc.model.TemplateFields(attributes.template_fields);
        this.subtemplates = new dc.model.Subtemplates(attributes.subtemplates);
        Backbone.Model.apply(this, arguments);
    },


    initialize: function(){
      //Init blank field collection
      this.updateSubURLs();

      //Make sure collection URL is always updated on ID change
      this.on('change:id', this.updateSubURLs, this);
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


    //Fetches base model and fields, then calls passed-in success function when done
    fetchWithFields: function(successFunction){
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
    updateSubURLs: function() {
       this.template_fields.url = this.url() + '/template_fields/';
       this.subtemplates.url = this.url() + '/subtemplates/';
    }
});


//*********************
// Template Collection
//*********************
dc.model.Templates = Backbone.Collection.extend({
    model : dc.model.Template,
    url: '/templates/index.json',
    comparator: 'name'
});


//**********************
// Template Field Model
//**********************
dc.model.TemplateField = Backbone.Model.extend({
    initialize: function() {
        if( this.get('template_id') != null ) {
            this.urlRoot = '/templates/' + this.get('template_id') + '/template_fields';
        }
    }
});


//*********************
// Template Field Collection
//*********************
dc.model.TemplateFields = Backbone.BulkSubmitCollection.extend({
    model : dc.model.TemplateField
});


//**********************
// Subtemplate Model
//**********************
dc.model.Subtemplate = Backbone.Model.extend({
    initialize: function() {
        if( this.get('template_id') != null ) {
            this.urlRoot = '/templates/' + this.get('template_id') + '/subtemplates';
        }
    },


    //Save subtemplate; on success, save fields
    saveAll: function(successFunction) {
        _thisModel = this;

        _thisModel.save({},{success: successFunction});
        //If template fields exist, push those first; otherwise just push this
        /*if(_thisModel.template_fields != null && _thisModel.template_fields.length > 0){
         _thisModel.template_fields.pushAll({
         success: function(){
         _thisModel.save({},{success: successFunction});
         }}, {
         error: function(){
         alert('Error communicating with server on save!');
         }});
         }else{
         _thisModel.save({},{success: successFunction});
         }*/

    },
});


//*********************
// Subtemplate Collection
//*********************
dc.model.Subtemplates = Backbone.BulkSubmitCollection.extend({
    model     : dc.model.Subtemplate,
    comparator: 'sub_name'
});

