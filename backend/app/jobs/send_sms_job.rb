require 'twilio-ruby'

class SendSmsJob < ApplicationJob
  queue_as :default

  def perform(phone_number, msg)
    
    account_sid = ENV['TWILIO_ACCOUNT_SID']
    auth_token = ENV['TWILIO_AUTH_TOKEN']
    twilio_default_number = ENV['TWILIO_DEFAULT_NUMBER']
    
    @client = Twilio::REST::Client.new(account_sid, auth_token)
    message = @client.messages.create(
      body: msg,
      from: "#{twilio_default_number}",
      to: "#{phone_number}"
    )
  end
end