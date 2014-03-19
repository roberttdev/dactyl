//****************
// Template Model
//****************
dc.model.Template = Backbone.Model.extend({
    urlRoot: '/templates'
});


//*********************
// Template Collection
//*********************
dc.model.Templates = Backbone.Collection.extend({
    model : dc.model.Template,
    url: '/templates/index.json'

});
