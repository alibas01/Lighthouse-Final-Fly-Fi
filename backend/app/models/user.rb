class User < ApplicationRecord
  has_secure_password 

  has_many :flights, :class_name => "User"
  
  validates :name, presence: true
  validates :name, length: { minimum: 2 }
  validates :email, presence: true
  validates :email, uniqueness: true

  validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i
end
