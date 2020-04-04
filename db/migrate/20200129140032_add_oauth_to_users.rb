class AddOauthToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :access_token, :string
    add_column :users, :access_token_secret, :string
    add_column :users, :goodreads_user_id, :string
    add_column :users, :display_name, :string
  end
end
