


export var nd = 
{
    core : "core",
}

var scValue = 
{
    core : null,
}

export function setSclass(name, newClass)
{
    if(name === nd.core)
    {
        scValue.core = newClass;

    }
}

export function getSclass(name)
{
    let rd;
    if(name === nd.core)
    {
        rd = scValue.core;
    }

    return rd;
}
export function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor( Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
  }


  export function seedMixedValue(seed ,min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor( seed * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
  }