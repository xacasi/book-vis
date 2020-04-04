class RemoveConstraintsFromUsers < ActiveRecord::Migration[6.0]
  def change
  	change_column :users, :email, :string, null:false
  	change_column :users, :encrypted_password, :string, null:false
  end
end
