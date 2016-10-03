'use strict';

const Hapi = require('hapi');
var Inert = require('inert');
var fs = require('fs');
const server = new Hapi.Server();
server.connection({
  port: 3000
});
server.register(Inert, function() {});
var stock = [];


server.route({
  method: 'POST',
  path: '/assets/inStock.json',
  handler: function(request, reply) {
    var newStock = JSON.parse(request.payload.newStock); // {name: "apple", price: 2, sku 78297}, for example
    stock.push(newStock);
    var inStock = {
      allStock: stock
    };
    return reply(inStock);
  }

});
server.route({
  method: 'GET',
  path: '/assets/inStock.json',
  handler: function(request, reply) {
    var allStock = {
      allStock: stock
    };
    return reply(allStock);
  }
});

server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    reply.file('./index.html');
  }
});

server.route({
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
        directory: {
            path: 'assets',
            listing: true
        }
    }
});

server.start((err) => {

  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});
