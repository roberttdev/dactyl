class SubtemplateFieldsController < ApplicationController
  def index
    json SubtemplateField.all(:conditions => ['subtemplate_id = ?', params[:subtemplate_id]])
  end

  def create
    field_attributes = pick(params, :subtemplate_id, :field_id)
    json SubtemplateField.create(field_attributes)
  end

  def destroy
    SubtemplateField.delete(params[:id])
    json({:success => 'true'})
  end

  def update
  end
end
