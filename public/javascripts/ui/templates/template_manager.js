dc.ui.TemplateManager = Backbone.View.extend({
  id: "template_manager_container",
  className: 'templates_tab_content',
  templateList: [],

  initialize: function(options){
    this.options = _.extend(this.options, options);
    this._mainJST = JST['template/template_main'];
    _.bindAll(this, 'open', 'render', 'createTemplateViews', 'createAndRender', 'openEditWindow');
    dc.app.navigation.bind('tab:templates', this.open);
  },


  render: function() {
    this.$el = $('#' + this.id);
    //Main
    this.$el.html(this._mainJST(this.options));
    //Listing rows
    this.$('.template_list').append(_.map(this.templateList, function(view, cid){
        view.render();
        view.$('#template_edit').on('click', {template_id: view.model.get('id')}, this.openEditWindow);
        return view.$el;
    }, this));

    return this.$el;
  },


  open: function() {
    if(!this.collection) {
        //If this is first open request, fetch data, initialize views, and render
        this.collection = new dc.model.Templates();
        this.collection.fetch({success: this.createAndRender, error: this.error});
    }

    dc.app.navigation.open('templates', true);
    Backbone.history.navigate('templates');
  },


  createTemplateViews: function() {
    this.collection.each(function(template) {
        this.templateList[template.id] = new dc.ui.TemplateListing({
            model: template
        }, this);
    }, this);
  },


  createAndRender: function() {
      this.createTemplateViews();
      this.render();
  },

  //Opens editing window.  Template ID to edit is passed in event data ('template_id').
  openEditWindow: function(event) {
      dc.ui.TemplateDataDialog.open(this.collection.get(event.data.template_id));
  },


  error : function(message, leaveOpen) {
    this._information.stop().addClass('error').text(message).show();
    if (!leaveOpen) this._information.delay(3000).fadeOut();
  }
});
