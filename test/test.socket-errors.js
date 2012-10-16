
var axon = require('../')
  , should = require('should')
  , requests = 0
  , replies = 0;

var req = axon.socket('req')
  , rep = axon.socket('rep');

rep.bind(3000);
req.connect(3000);

rep.on('message', function(msg, reply){
  ++replies.should.equal(1);
  msg.should.have.length(1024);
  reply('ok');
});

// large message (so it chunks) after connect should give EPIPE or ECONNRESET
req.once('connect', function(){
  req.send(new Buffer(1024 * 1000), function(res){
    ++requests.should.equal(1);
    res.toString().should.equal('ok');
    rep.close();
    req.close();
  });

  rep.close();

  setTimeout(function(){
    rep.bind(3000);
  }, 100);
});




