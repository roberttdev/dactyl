dc.ui.TemplateManager = Backbone.View.extend({
  id: "template_manager_container",
  className: 'templates_tab_content',
  templateList: [],
  _newTemplate: null,

  initialize: function(options){
    this.options = _.extend(this.options, options);
    this._mainJST = JST['template/template_main'];
    _.bindAll(this, 'open', 'render', 'createTemplateViews', 'createAndRender', 'openCreateWindow', 'addNewTemplateToList');
    dc.app.navigation.bind('tab:templates', this.open);
  },


  render: function() {
    this.$el = $('#' + this.id);
    //Main
    this.$el.html(this._mainJST(this.options));

    //Link event(s)
    this.$('#new_template').on('click', {}, this.openCreateWindow);

    //Listing rows
    this.$('.template_list').append(_.map(this.templateList, function(view, cid){
        view.renderWithEvents();
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


  openCreateWindow: function() {
      this._newTemplate = new dc.model.Template();
      this._newTemplate.on('change', this.addNewTemplateToList, this);
      dc.ui.TemplateDataDialog.open(this._newTemplate);
  },


  //Add new template to collection and view, and remove events meant to track creation
  addNewTemplateToList: function() {
      this.collection.add(this._newTemplate);
      this._newTemplate.off('change', this.addNewTemplateToList);
      _newTemplateView = new dc.ui.TemplateListing({
          model: this._newTemplate
      }, this);
      this.templateList[this._newTemplate.id] = _newTemplateView;
      _newTemplateView.renderWithEvents();
      this.$('.template_list').append(_newTemplateView.$el);
  },


  error : function(message, leaveOpen) {
    this._information.stop().addClass('error').text(message).show();
    if (!leaveOpen) this._information.delay(3000).fadeOut();
  }
});
