class GroupTemplate < ActiveRecord::Base
  has_many :template_fields, :foreign_key => 'template_id'
  has_many :subtemplates, :foreign_key => 'template_id'

  def to_json(opts={})
    json = {
      :id => id,
      :name => name,
      :template_fields => template_fields,
      :subtemplates => subtemplates
    }.to_json()
  end
end
