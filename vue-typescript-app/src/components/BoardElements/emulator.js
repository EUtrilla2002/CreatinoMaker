// src/hooks/hookMap.js
import boardData from "./esp32c3.json";

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const hookMap = {
  0x100: function cr_digitalWrite(cpu, connections, setLedState) {
    const pin = cpu.registerSet.getRegister(10); // a0
    const value = cpu.registerSet.getRegister(11); // a1
    console.log(`cr_digitalWrite invoked! pin: ${pin}, value: ${value}`);
    const GPIOpin = "GPIO" + pin;
    console.log(GPIOpin);
    // Lógica de funcionamiento
    if (boardData.pins.includes(GPIOpin)) {
      //setLedState(value);
      if (GPIOpin != 'GPIO8'){ //InsidePin
        console.log(connections);
        // Lógica de conexion: patita izq en el GND y patita drcha en un GPIO
        console.log(connections)
        const gpioConnection = connections.find(
          (conn) => conn.fromPinId === GPIOpin && conn.toPinId.endsWith("right")
        );
        const gndConnection = connections.find(
          (conn) => conn.fromPinId.includes("GND") && conn.toPinId.endsWith("left")
        );
        const existsGPIO = !!gpioConnection;
        const existsGND = !!gndConnection;
        console.log(
          "Estado pin drcho",
          existsGPIO,
          ", Estado pin izq:",
          existsGND
        );
        if (existsGPIO == true && existsGND == true) {
          //setLedState(value);
          const toPinId = gpioConnection.toPinId;
          console.log("toPinId del LED:", toPinId);

          const lastDashIndex = toPinId.lastIndexOf("-");
          const ledId = toPinId.substring(0, lastDashIndex);

          const toElement = document.getElementById(ledId);
          console.log("Elemento LED:", toElement);

          const wokwiLed = toElement.querySelector("wokwi-led");
          console.log(wokwiLed.value); // ver valor actual
          console.log(value)
          wokwiLed.value = !!value; // fuerza a boolean


          console.log(wokwiLed.value); // ver valor actual
        } else {
          console.log("Not connected");
        }

      }
      
    }
    cpu.pc = cpu.registerSet.getRegister(1); // ret
  },

  0x104: async function cr_delay(cpu, setLedState) {
    const time = cpu.registerSet.getRegister(10);
    console.log(`cr_delay invoked! time: ${time}ms`);

    const start = Date.now();
    await sleep(time);
    const end = Date.now();

    console.log(`Sleep duró aproximadamente: ${end - start}ms`);
    cpu.pc = cpu.registerSet.getRegister(1);
  },
};

export default hookMap;
