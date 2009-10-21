// Label Model

dc.model.Label = dc.Model.extend({
  
  constructor : function(options) {
    this.base(options);
    _.bindAll('addSelectedDocuments', this);
  },
  
  addSelectedDocuments : function() {
    Labels.update(this, {document_ids : Documents.selectedIds()});
  }
  
});


// Label Set

dc.model.LabelSet = dc.model.RESTfulSet.extend({
  
  resource : 'labels',
  
  // Find a label by title.
  find : function(title) {
    return _.detect(this.models(), function(m){ return m.get('title') == title; });
  },
  
  // Find all labels starting with a given prefix, for autocompletion.
  startingWith : function(prefix) {
    var matcher = new RegExp('^' + prefix);
    return _.select(this.models(), function(m){ return !!m.get('title').match(matcher); });
  }
  
});

window.Labels = new dc.model.LabelSet();
