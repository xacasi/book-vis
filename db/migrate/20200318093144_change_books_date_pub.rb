class ChangeBooksDatePub < ActiveRecord::Migration[6.0]
  def change
  	change_column :books, :date_pub, :date
  end
end
