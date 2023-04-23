# -*- encoding: utf-8 -*-
$:.push File.expand_path("../rb", __FILE__)

Gem::Specification.new do |s|
	s.name        = "remino-reslib"
	s.version     = "0.1.0"
	s.platform    = Gem::Platform::RUBY
	s.authors     = ["Rémino Rem"]
	s.homepage    = "https://remino.net"
	s.summary     = %q{Rémino Site Library: Common JavaScript and Ruby functions for websites by Rémino}
	# s.description = %q{A longer description of your extension}

	s.files         = `git ls-files -- rb/*`.split("\n")
	s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
	s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
	s.require_paths = ["rb"]

	# The version of middleman-core your extension depends on
	s.add_runtime_dependency("middleman-core", [">= 4.4.2"])

	# Additional dependencies
	# s.add_runtime_dependency("gem-name", "gem-version")
end
