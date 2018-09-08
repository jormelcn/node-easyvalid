# CLI
Módulo Javasctipt/Typescript que permite validar facilmente datos en objetos con estructuras complejas.

# Descripción
easyvalid permite implementar muy facilmente validaciones de datos de cualquier tipo y con cualquier clase de condiciones.

# Instalación
npm install -s easyvalid

# Ejemplo de Uso simple en Typescript

```Typescript
import { EasyValid, ValueValidator} from 'easyvalid';
import { EasyError } from 'easyerror';

// **************** Definimos nuestros validadores personalizados ************************

//Validador de Email (ejemplo, no usar en producción)
const emailValidator : ValueValidator<string> = (value, conditions) => {
  if(typeof value !== 'string')
    throw new EasyError('Email inválido, No es un string');
  if(value.indexOf('@') > 0){
     return value; //Retornar el valor validado
  } else {
    throw new EasyError('Email inválido, No se encontró @');
  }
} 

//Validador de valores numéricos
const numberValidator : ValueValidator<number> = (value, conditions) => {
  //Verificar el tipo de dato de entrada
  if(typeof value != 'number' && typeof value != 'string') 
    throw new EasyError(`Número inválido`);
  //Verificar que es un valor numérico
  let out = +value;
  if(isNaN(out)) throw new EasyError('Número inválido');
  //Verificar condiciones adicionales
  if(conditions.length >= 1 && out < +conditions[0])
    throw new EasyError(`Número inválido, es menor que ${conditions[0]}`);
  if(conditions.length >= 2 && out > +conditions[1])
    throw new EasyError(`Número inválido, es mayor que ${conditions[1]}`);
  return out; //Retornar el valor validado
}


//*******************************  Creamos el Validador *********************************

const easyValid = new EasyValid({
  'number' : numberValidator,
  'email' : emailValidator
});


// ************** Creamos una plantilla del tipo de dato a validar *************** 

//Plantilla de un objeto simple
const template1 = easyValid.parseTemplate(
  {
    edad : 'number',
    porcentaje : 'number:0:100', //tipo con condiciones
    info : {
      pais : 'string',
      email : 'email'
    }
  }
);


// ********************** Validamos usando la plantilla ************************

//Objeto no valido
const noValid = {
  edad : '20',
  porcentaje : 40,
  info : {
    pais : 'colombia',
    email : 'asdjajdasd'
  }
};

//Objeto valido
const valid = {
  edad : '20',
  porcentaje : 40,
  info : {
    pais : 'colombia',
    email : 'email@dominio.com'
  }
}

try {
  console.log('Valid Data:');
  const validData = easyValid.validate(valid, template1);  
  console.dir(validData);
  console.log()

  console.log('Invalid Data:');
  const invalidData = easyValid.validate(noValid, template1);  
  console.dir(invalidData);
}catch(e){
  if(e instanceof EasyError)
    console.error(`Error In ${e.getTrace()} : ${e.message}`);
  else 
    console.error(`Error : ${e.message}`);
  console.log();
}

```


# Uso avanzado

EasyValid incluye por defecto cuatro validatores : numeric, string, null, undefined
que realizan validaciones básicas para dato numerico, cadena de caracteres, valor null y datos indefinidos.
los validadores por defecto y los personalizados pueden usarse en conjunto para más posibilidades de validación.
Pueden generarse plantillas de validación de modelos complejos de datos.

```Typescript
// **************  plantillas Avanzadas *************** 

//Plantilla de un array
const template2 = easyValid.parseTemplate(
  [
    {
      nombre : 'string',
      //Pueden usarse Varios validadores, será valido si cumple con almenos uno
      edad : 'number|null|undefined'
    }
  ]
);


//Plantilla de un Modelo 
class Usuario {
  //Se debe definir $template en la clase como estático
  static $template = {
    nombre : 'string',
    email : 'email|undefined'
  }

  email : string;

  constructor(
    public nombre : string
  ){ }

  setEmail(email){
    this.email = email;
  }
}

const template3 = easyValid.parseTemplate(Usuario);


//Plantilla compleja (Puede realizarce cualquier combinación)

class Businessman {
  static $template = {
    user : Usuario,
    hijos : [ 
      {
        nombre : 'string',
        edad : 'number'
      }
    ],
    socios : [ Usuario ]
  }

  user : Usuario;
  hijos : any[];
  socios : Usuario[]
}

const template4 = easyValid.parseTemplate(Businessman);


const toValidate = {
  user : {
    nombre : 'Nombre del usuario',
  },
  hijos : [
    { nombre : 'Hijo 1', edad : 10 },
    { nombre : 'Hijo 2', edad : 12 },
    { nombre : 'Hijo 3', edad : 5 }
  ],
  socios : [new Usuario('socio 1'), new Usuario('socio 2')]
};


try {
  console.log('Valid complex Data:');
  const validData : Businessman = easyValid.validate(toValidate, template4);  
  console.dir(validData);
  console.log()
  
  validData.user.setEmail('email.agregado@dominio.com');
  console.dir(validData.user);
  console.log()
}catch(e){
  if(e instanceof EasyError)
    console.error(`Error In ${e.getTrace()} : ${e.message}`);
  else 
    console.error(`Error : ${e.message}`);
  console.log();
}


```
