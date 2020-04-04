class AddUserToBooks < ActiveRecord::Migration[6.0]
  def change
    add_reference :books, :user, index: true
  end
end
