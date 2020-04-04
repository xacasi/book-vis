class User < ApplicationRecord
	has_many :shelves, dependent: :destroy
	has_many :books, dependent: :destroy
	has_one_attached :avatar
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  	devise :registerable, :rememberable, :database_authenticatable

  def will_save_change_to_email?
    false
  end

end
