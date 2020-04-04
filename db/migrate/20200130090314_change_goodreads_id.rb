class ChangeGoodreadsId < ActiveRecord::Migration[6.0]
  def change
  	change_column :users, :goodreads_user_id, 'integer USING CAST(goodreads_user_id AS integer)'
  end
end
