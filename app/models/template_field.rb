class TemplateField < ActiveRecord::Base
  belongs_to :group_template

  def to_json()
    json = {
        :id => id,
        :field_name => field_name
    }.to_json()
  end
end
