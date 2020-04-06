class AddShowToShelves < ActiveRecord::Migration[6.0]
  def change
    add_column :shelves, :show, :boolean, default: true
  end
end
