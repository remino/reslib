# Require core library
require 'middleman-core'

# Extension namespace
class ReslibMiddlemanDate < ::Middleman::Extension
	# option :my_option, 'default', 'An example option'

	def initialize(app, options_hash={}, &block)
		# Call super to build options from the options_hash
		super

		# Require libraries only when activated
		# require 'necessary/library'

		# set up your extension
		# puts options.my_option
	end

	# def after_configuration
	#   # Do something
	# end

	# A Sitemap Manipulator
	# def manipulate_resource_list(resources)
	# end

	helpers do
		def format_date(date, format = :short)
			case format
			when :rfc2822 then date.to_time.rfc2822
			else I18n.l date, format: format
			end
		end
	end
end
