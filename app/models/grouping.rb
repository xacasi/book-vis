class Grouping < ApplicationRecord
	has_and_belongs_to_many :shelves, optional: true
end
