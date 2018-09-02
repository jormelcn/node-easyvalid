const EasyValid = require('../dist/easy-valid');

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

M2.$template = {
  a : 'string',
  b : 'numeric|string'
};


const valid = new EasyValid.EasyValid();
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
    p4 : [M1, M2]
  });

  let v1 = p1.validator('5', p1.conditions);
  let v2 = p2.validator([-100.4, '5', '1', '6'], p2.conditions);
  let v3 = p3.validator({a : '5', key1 : 400}, p3.conditions);
  let v4 = p4.validator({a : '5', b : 56}, p4.conditions);
  let v5 = p5.validator({
    m1 : { a : 5, b : 'hello'},
    p2 : 45,
    p3 : {p31 : 'jaja', m2 : new M2('10')},
    p4 : [new M1('aa'), new M2(5), {a : 4, b : 'jeje'}]
  }, p5.conditions);

  console.log(v1);
  console.log(v2);
  console.log(v3);
  console.log(v4);
  console.log(v5);
  process.exit();
}catch(e){
  console.error('Error :' + e.message);
  process.exit();
}
