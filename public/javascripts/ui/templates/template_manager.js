dc.ui.TemplateManager = Backbone.View.extend({
  id: "template_manager_container",
  className: 'templates_tab_content',
  templateList: [],
  _newTemplate: null,

  initialize: function(options){
    this.options = _.extend(this.options, options);
    this._mainJST = JST['template/template_main'];
    _.bindAll(this, 'open', 'render', 'createTemplateViews', 'createTemplateView', 'createAndRender', 'openCreateWindow', 'addNewTemplateToList', 'openSubtemplateWindow');
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
        view.render();
        return view.$el;
    }, this));

    return this.$el;
  },


  open: function() {
    if(!this.collection) {
        //If this is first open request, fetch data, initialize views, and render
        this.collection = new dc.model.Templates();
        this.collection.fetch({data:{subtemplates: true}, success: this.createAndRender, error: this.error});
    }

    dc.app.navigation.open('templates', true);
    Backbone.history.navigate('templates');
  },


  createTemplateViews: function() {
    this.collection.each(function(template) {
        this.createTemplateView(template);
    }, this);
  },


  createTemplateView: function(model) {
      _templateView = new dc.ui.TemplateListing({
          model: model
      }, this);
      this.templateList.push(_templateView);
      _templateView.on('newSubtemplateRequest', this.openSubtemplateWindow);
      return _templateView;
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


  openSubtemplateWindow:  function(template_id) {
      this._newTemplate = new dc.model.Subtemplate({template_id: template_id});
      this._newTemplate.on('change', this.addNewSubtemplateToList, this);
      dc.ui.SubtemplateDataDialog.open(this._newTemplate);
  },


  //Add new template to collection and view, and remove events meant to track creation
  addNewTemplateToList: function() {
      this.collection.add(this._newTemplate);
      this._newTemplate.off('change', this.addNewTemplateToList);
      _newTemplateView = this.createTemplateView(this._newTemplate);
      _newTemplateView.render();
      this.$('.template_list').append(_newTemplateView.$el);
  },


  //Look up template view and tell it to add the new subtemplate
  addNewSubtemplateToList: function() {
      this._newTemplate.off('change', this.addNewSubtemplateToList);
      _template = this.collection.get(this._newTemplate.get('template_id'));
      _templateView = this.templateList[this.collection.indexOf(_template)];
      _templateView.addNewSubtemplate(this._newTemplate);
  },


  error : function(message, leaveOpen) {
    this._information.stop().addClass('error').text(message).show();
    if (!leaveOpen) this._information.delay(3000).fadeOut();
  }
});
