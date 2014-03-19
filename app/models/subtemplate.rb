class Subtemplate < ActiveRecord::Base
  belongs_to :group_template
  has_many :subtemplate_fields

  def to_json()
    json = {
      :sub_name => sub_name,
      :subtemplate_fields => subtemplate_fields.map{ |a| a.id}
    }.to_json()
  end
end
