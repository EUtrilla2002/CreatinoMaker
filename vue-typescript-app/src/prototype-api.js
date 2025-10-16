// Prototipe of creatino_definition_api.js

const hookMap = {
  0x100: function cr_digitalWrite() {}           
function capi_arduino (funcName, pc_state)
{
	var key = Number(pc_state) + Number(funcName) - 4; 
	console.log("CREATino function called: " + key) ;
    if (key in hookMap)
    {
        hookMap[Math.abs(key)]();
        return true;
    }
    else {
        console.log("Not Arduino") ;
        return false;
    }
}