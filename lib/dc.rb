module DC

  # The canonical server root, including SSL, if requested.
  def self.server_root(options={:ssl => true, :agnostic => false, })
    root = 'http://'
    root = 'https://' if DC_CONFIG['ssl_on'] && (options[:force_ssl] || (options[:ssl] && Thread.current[:ssl]))
    root = '//' if options[:agnostic]
    root + DC_CONFIG['server_root']
  end

end