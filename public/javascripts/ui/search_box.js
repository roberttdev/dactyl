// The search controller is responsible for managing document/metadata search.
dc.ui.SearchBox = dc.View.extend({
    
  PAGE_MATCHER : (/\/p(\d+)$/),
  
  fragment : null,
  currentPage : null,
    
  callbacks : [
    ['el',  'keydown',  'maybeSearch']
  ],
  
  // Creating a new SearchBox registers #search page fragments.
  constructor : function() {
    this.base({el : $('#search')[0]});
    this.outstandingSearch = false;
    this.setCallbacks();
    _.bindAll('loadSearchResults', 'loadMetadataResults', 'searchByHash', 'saveCurrentSearch', this);
    dc.history.register(/^#search\//, this.searchByHash);
  },
  
  // Shortcut to the searchbox's value.
  value : function(query) {
    return $(this.el).val(query);
  },
  
  // Start a search for a query string, updating the page URL.
  search : function(query, pageNumber) {
    if (dc.app.navigation) dc.app.navigation.tab('search');
    var page = pageNumber <= 1 ? null : pageNumber;
    this.value(query);
    this.fragment = 'search/' + encodeURIComponent(query);
    dc.history.save(this.fragment + (page ? '/p' + page : ''));
    $('.documents').html('');
    $('#metadata_container').html('');
    $('#query_container').html('');
    this.outstandingSearch = true;
    dc.ui.spinner.show('searching');
    this.contextSensitiveSaveButton(query);
    if (dc.app.toolbar) dc.app.toolbar.hide();
    var params = {query_string : query};
    this.currentPage = page;
    if (page) params.page = page;
    $.get('/search.json', params, this.loadSearchResults, 'json');
  },
  
  // When searching by the URL's hash value, we need to unescape first.
  searchByHash : function(hash) {
    var page = null;
    var pageMatch = hash.match(this.PAGE_MATCHER);
    if (pageMatch) {
      var page = pageMatch[1];
      hash = hash.replace(this.PAGE_MATCHER, '');
    } 
    this.search(decodeURIComponent(hash), page);
  },
  
  // Callback fired on key press in the search box. We search when they hit
  // return.
  maybeSearch : function(e) {
    if (!this.outstandingSearch && e.keyCode == 13 && this.value()) {
      this.search(this.value());
    }
  },
  
  // Hide the spinner and remove the search lock when finished searching.
  doneSearching : function() {
    dc.ui.spinner.hide();
    this.outstandingSearch = false;
  },
  
  // After the initial search results come back, send out a request for the
  // associated metadata, as long as something was found. Think about returning
  // the metadata right alongside the document JSON.
  loadSearchResults : function(resp) { 
    dc.app.paginator.setQuery(resp.query);
    Documents.refresh(_.map(resp.documents, function(m){ 
      return new dc.model.Document(m); 
    }));
    $('#query_container').html(new dc.ui.Query(resp.query).render().el);
    $('#document_list_container').html((new dc.ui.DocumentList()).render().el);
    Documents.each(function(el) {
      $('.documents').append((new dc.ui.DocumentTile(el)).render().el);
    });
    if (resp.documents.length == 0) return this.doneSearching();
    dc.ui.spinner.show('gathering metadata');
    var docIds = _.pluck(resp.documents, 'id');
    $.get('/documents/metadata.json', {'ids[]' : docIds}, this.loadMetadataResults, 'json');
  },
  
  // When the metadata results come back, render the entity list in the sidebar 
  // afresh.
  loadMetadataResults : function(resp) {
    Metadata.refresh();
    _.each(resp.metadata, function(m){ Metadata.addOrCreate(m); });
    Metadata.sort();
    var mView = new dc.ui.MetadataList({metadata : Metadata.models()});
    $('#metadata_container').html(mView.render().el);
    this.doneSearching();
  },
  
  saveCurrentSearch : function() {
    var options = {anchor : this.saveSearchButton, position: 'left center', left: -12, top: -1};
    SavedSearches.create(new dc.model.SavedSearch({query : this.value()}), null, {success : function() {
      dc.ui.notifier.show(_.extend(options, {mode : 'info', text : 'search saved'}));
    }, error : function(model) {
      if (model.view) $(model.view.el).remove();
      dc.ui.notifier.show(_.extend(options, {text : 'search already saved'}));
    }});
  },
  
  addSaveSearchButton : function() {
    this.saveSearchButton = $.el('div', {id : 'save_search', 'class' : 'minibutton tab_content search_tab_content'}, 'save this search');
    $(document.body).append(this.saveSearchButton);
    $(this.saveSearchButton).bind('click', this.saveCurrentSearch);
  },
  
  contextSensitiveSaveButton : function(query) {
    if (!this.saveSearchButton) return;
    $(this.saveSearchButton).css({opacity : SavedSearches.find(query) ? 0 : 1});
  }
  
});