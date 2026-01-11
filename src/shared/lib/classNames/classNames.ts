
type Mods = Record <string, Boolean | String>


export function classNames(cls:string,mods:Mods,additional:string[]):string{
return  [cls,
  ...additional,
  ...Object.entries(mods)
  .filter(([key,value])=>Boolean(value))
  .map(([className])=>className)
  
].join(" ")


  
}