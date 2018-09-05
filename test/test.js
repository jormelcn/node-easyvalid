const EasyValid = require('../dist/lib/easy-valid').EasyValid;
const EasyError = require('easyerror').EasyError;

function M1(a) {
  this.a = a;
  this.b = a;
}

function M2(a) {
  this.a = a;
  this.b = a;
}

M1.$template = {
  a : 'numeric',
  b : 'string'
};

M1.prototype.print = function() {
  console.log(this.a + this.b);
}

M2.$template = {
  a : 'string',
  b : 'numeric|null|undefined'
};


const valid = new EasyValid();
try{
  let p1 = valid.parseTemplate('numeric:0:1');
  let p2 = valid.parseTemplate(['numeric:0:1']);
  let p3 = valid.parseTemplate({
    key1 : 'numeric:0:1'
  });
  let p4 = valid.parseTemplate(M1);
  let p5 = valid.parseTemplate({
    m1 : M1,
    p2 : 'numeric',
    p3 : {
      p31 : 'string',
      m2 : M2
    },
    p4 : [M1]
  });

  let v1 = p1.validator('5', p1.conditions);
  let v2 = p2.validator([-100.4, '5', '1', '6'], p2.conditions);
  let v3 = p3.validator({a : '5', key1 : 400}, p3.conditions);
  let v4 =  p4.validator({a : '5', b : 56}, p4.conditions);
  let v5 = valid.validate({
    m1 : { a : 5, b : 'hello'},
    p2 : 45,
    p3 : {p31 : 'jaja', m2 : new M2('10')},
    p4 : [new M2(5), new M1('12'), {a : 4, b : 'jeje'}]
  }, p5);

  console.log(v1);
  console.log(v2);
  console.log(v3);
  console.log(v4);
  console.log(v5);
  v5.p4[2].print();
  process.exit();
}catch(e){
  if(e instanceof EasyError)
    console.error(`Error In ${e.getTrace()} : ${e.message}`);
  process.exit();
}
