class Book < ApplicationRecord
  has_and_belongs_to_many :shelves, optional: true
  belongs_to :user
  has_many :book_dates, dependent: :destroy
end
