var config = {
  development: {
    client_id: '2ca85a89c5f1a9b7dca3',
    redirect_uri: 'http://simon.local:9966/',
    gatekeeper: 'http://127.0.0.1:9999'
  },
  production: {
    client_id: '2ca85a89c5f1a9b7dca3',
    redirect_uri: 'http://simon.local:9966/',
    gatekeeper: 'http://127.0.0.1:9999'
  }
}

module.exports = config[process.env.NODE_ENV]
