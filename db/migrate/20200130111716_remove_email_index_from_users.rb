class RemoveEmailIndexFromUsers < ActiveRecord::Migration[6.0]
  def change
  	remove_index :users, column: :email
  end
end
