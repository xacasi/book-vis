class CreateBookDates < ActiveRecord::Migration[6.0]
  def change
    create_table :book_dates do |t|
      t.belongs_to :book, null: false, foreign_key: true
      t.datetime :date_started
      t.datetime :date_finished

      t.timestamps
    end
  end
end
