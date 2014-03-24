# The TemplatesController is responsible for managing templates and their fields.
class TemplatesController < ApplicationController
  layout 'workspace'

  before_filter :secure_only, :only => [:enable, :reset]
  before_filter :login_required, :except => [:enable, :reset, :logged_in]
  before_filter :bouncer, :only => [:enable, :reset] if Rails.env.staging?

  #The index is a simple listing of templates.
  def index
    respond_to do |format|
      format.html do
        if logged_in?
          if current_account.real?
            return render :layout => 'workspace'
          else
            return redirect_to '/public/search'
          end
        end
        redirect_to '/home'
      end
      format.json do
        json GroupTemplate.all()
      end
    end
  end

  # Does the current request come from a logged-in account?
  def logged_in
    return bad_request unless request.format.json? or request.format.js?
    @response = {:logged_in => logged_in?}
    json_response
  end

  # Fetches or creates a user account and creates a membership for that
  # account in an organization.
  # 
  # New accounts are created as pending, with a security key instead of
  # a password.
  def create
    # Check the requester's permissions
    return forbidden unless current_account.admin? or 
      (current_account.real?(current_organization) and params[:role] == Account::REVIEWER)

    # Find or create the appropriate account
    account_attributes = pick(params, :first_name, :last_name, :email, :language, :document_language)
    account = Account.lookup(account_attributes[:email]) || Account.create(account_attributes)    

    # Find role for account in organization if it exists.
    membership_attributes = pick(params, :role, :concealed)
    membership = current_organization.role_of(account)
    
    # Create a membership if account has no existing role
    if membership.nil?
      membership_attributes[:default] = true unless account.memberships.exists?
      membership = current_organization.memberships.create(membership_attributes.merge(:account_id => account.id))
    elsif membership.role == Account::REVIEWER # or if account is a reviewer in this organization
      account.upgrade_reviewer_to_real(current_organization, membership_attributes[:role])
    elsif membership.role == Account::DISABLED
      return json({:errors => ['That email address belongs to an inactive account.']}, 409)
    else
      return json({:errors => ['That email address is already part of this organization']}, 409)
    end

    if account.valid?
      if account.pending?
        account.send_login_instructions(current_account)
      else
        LifecycleMailer.deliver_membership_notification(account, current_organization, current_account)
      end
    end
    json account.canonical( :membership=>membership )
  end

  # Update a template.
  def update
    template = GroupTemplate.find(params[:id])
    unless template.update_attributes pick(params, :name)
      return json({ "errors" => template.errors.to_a.map{ |field, error| "#{field} #{error}" } }, 409)
    end

    return json({"success" => true})
  end

  # Removing an account only changes their role so that they cannot
  # login. Ther documents, projects, and name remain.
  def destroy
    return forbidden unless current_account.admin?
    account = current_organization.accounts.find(params[:id])
    account.update_attributes :role => Account::DISABLED
    json nil
  end

end
