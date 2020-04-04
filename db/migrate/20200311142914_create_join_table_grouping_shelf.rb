class CreateJoinTableGroupingShelf < ActiveRecord::Migration[6.0]
  def change
    create_join_table :groupings, :shelves do |t|
      # t.index [:grouping_id, :shelf_id]
      # t.index [:shelf_id, :grouping_id]
    end
  end
end
