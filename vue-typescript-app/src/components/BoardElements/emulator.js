// src/hooks/hookMap.js
import boardData from "./esp32c3.json";

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const hookMap = {
  0x100: function cr_digitalWrite(cpu, connections, setLedState, boardElementRef) {
    const pin = cpu.registerSet.getRegister(10); // a0
    const value = cpu.registerSet.getRegister(11); // a1
    console.log(`cr_digitalWrite invoked! pin: ${pin}, value: ${value}`);
    const GPIOpin = "GPIO" + pin;
    console.log(GPIOpin);
    // Lógica de funcionamiento
          //setLedState(value);
    if (GPIOpin == 'GPIO8'){
        if (boardElementRef && boardElementRef.value && typeof boardElementRef.value.setGPIO8State === 'function') {
          boardElementRef.value.setGPIO8State(!!value);
        } else {
          console.warn('No se pudo acceder a setGPIO8State');
        }
      }

    if (boardData.pins.includes(GPIOpin)) {
        console.log(connections);
        // Lógica de conexion: patita izq en el GND y patita drcha en un GPIO
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

  0x108: function cr_digitalRead(cpu, connections, setLedState, boardElementRef) {
    const pin = cpu.registerSet.getRegister(10); // a0
    console.log(`cr_digitalRead invoked! pin: ${pin}`);
    const GPIOpin = "GPIO" + pin;
    console.log(GPIOpin);
    if (boardData.pins.includes(GPIOpin)) {
      const gpioConnection = connections.find(
        (conn) => conn.fromPinId === GPIOpin && conn.toPinId.endsWith("upleft")
      );
      const gndConnection = connections.find(
          (conn) => conn.fromPinId.includes("GND") && conn.toPinId.endsWith("downright")
        );
      const existsGPIO = !!gpioConnection;
      const existsGND = !!gndConnection;
      console.log("Estado pin drcho arriba", existsGPIO);

      if (existsGPIO && existsGND) {
        const toPinId = gpioConnection.toPinId;
        console.log("toPinId del Botón:", toPinId);

        const lastDashIndex = toPinId.lastIndexOf("-");
        const buttonId = toPinId.substring(0, lastDashIndex);

        const toElement = document.getElementById(buttonId);
        console.log("Elemento Boton:", toElement);

        const wokwiButton = toElement.querySelector("wokwi-pushbutton");
        console.log("¿Botón presionado?", wokwiButton.pressed);
        cpu.registerSet.setRegister(10, pressed ? 1 : 0); // Set register 10 to 1 if pressed, otherwise 0
      } else {
        console.log("Not connected");
        cpu.registerSet.setRegister(10, 0); // Set register 10 to 0 if not connected
      }
    }
    else { cpu.registerSet.setRegister(10, 0); }
    cpu.pc = cpu.registerSet.getRegister(1); // ret
  },
};

export default hookMap;
