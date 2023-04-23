require "middleman-core"

Middleman::Extensions.register :reslib_date do
  require "remino-reslib/middleman/date/extension"
  ReslibMiddlemanDate
end
