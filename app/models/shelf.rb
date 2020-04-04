class Shelf < ApplicationRecord
	belongs_to :user
	has_many :children, class_name: "Shelf", foreign_key: "parent_id"
	belongs_to :parent, class_name: "Shelf", optional: true
	has_and_belongs_to_many :books, optional: true
	has_and_belongs_to_many :groupings, optional: true
end
