class TemplateField < ActiveRecord::Base
  belongs_to :group_template, :foreign_key => "template_id"

  def to_json(opts={})
    json = {
        :id => id,
        :template_id => template_id,
        :field_name => field_name
    }.to_json()
  end
end
