dc.ui.TemplateDataDialog = dc.ui.Dialog.extend({

  id        : 'edit_template_dialog',
  className : 'dialog tempalog',

  dataEvents : {
      'click .cancel'     : 'close',
      'click .ok'         : 'save',
      'focus input'       : '_addFocus',
      'focus textarea'    : '_addFocus',
      'blur input'        : '_removeFocus',
      'blur textarea'     : '_removeFocus',
      'change input'      : '_markChanged'
  },


  constructor : function(template) {
    this.events       = _.extend({}, this.events, this.dataEvents);
    this.template         = template;
    this._mainJST = JST['template/template_dialog'];
    dc.ui.Dialog.call(this, {mode : 'custom', title : _.t('edit_template'), saveText : _.t('save') });
    this.render();
    $(document.body).append(this.el);
  },


  render : function() {
    dc.ui.Dialog.prototype.render.call(this);
    this._container = this.$('.custom');
    this._container.html(this._mainJST({
      data          : this.template
    }));
    $('#template_name').val(this.template.get('name'));
    return this;
  },


  save : function() {
    //Require name
    if(this.$('#template_name').val().length == 0){
        this.$('#template_name').addClass('error');
        return this.error(_.t('template_name_required'));
    }

    this.template.save({name: this.$('#template_name').val()});
    this.close();
  },


  // On change, mark input field as dirty.
  _markChanged : function(e) {
      $(e.target).addClass('change');
  }

}, {

  // This static method is used for conveniently opening the dialog for
  // any selected template.
  open : function(template) {
    new dc.ui.TemplateDataDialog(template);
  }

});
