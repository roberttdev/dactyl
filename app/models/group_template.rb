class GroupTemplate < ActiveRecord::Base
  has_many :template_fields, :foreign_key => 'template_id', :dependent => :delete_all
  has_many :subtemplates, :foreign_key => 'template_id'

  def to_json(opts={})
    json = {
      :id => id,
      :name => name}

    if(opts[:children])
      json[:template_fields] = template_fields
      json[:subtemplates] = subtemplates
    end

    json.to_json()
  end
end
