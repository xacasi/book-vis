class CreateBooks < ActiveRecord::Migration[6.0]
  def change
    create_table :books do |t|
      t.integer :work_id
      t.string :title
      t.string :author
      t.integer :read_count
      t.integer :rating
      t.datetime :date_pub
      t.string :format
      t.integer :num_pages

      t.timestamps
    end
  end
end
