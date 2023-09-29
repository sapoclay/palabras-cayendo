// Esta función toma el texto de un elemento con clase "text",
// divide el texto en palabras, y envuelve cada palabra en un elemento <span>.
// Si una palabra comienza con ciertos términos, la resalta con una clase "highlighted".

const splitWords = () => {
  try {
    // Obtener el nodo de texto con la clase "text"
    const textNode = document.querySelector(".text");
    const text = textNode.textContent;
    // Crear un nuevo array de elementos DOM a partir del texto
    const newDomElements = text.split(" ").map((text) => {
      const highlighted =
        text.startsWith(`código`) ||
        text.startsWith(`artículos`) ||
        text.startsWith(`entreunosyceros`);
      return `<span class="word ${highlighted ? "highlighted" : null
        }">${text}</span>`;
    });
    // Reemplazar el contenido del nodo de texto con los nuevos elementos
    textNode.innerHTML = newDomElements.join("");
  } catch (error) {
    console.error("Error en splitWords:", error);
  }
};

// Esta función inicializa un motor de física (Matter.js) y crea un entorno de simulación.
const renderCanvas = () => {
  try {
    // Importar objetos Matter necesarios
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Runner = Matter.Runner;
    // Definir parámetros y tamaño del lienzo
    const params = {
      isStatic: true,
      render: {
        fillStyle: "transparent"
      }
    };
    const canvasSize = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // Crear un motor y un renderizador
    const engine = Engine.create({});
    const render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        ...canvasSize,
        background: "transparent",
        wireframes: false
      }
    });

    // Crear cuerpos físicos (piso, paredes, etc.)
    const floor = Bodies.rectangle(
      canvasSize.width / 2,
      canvasSize.height,
      canvasSize.width,
      50,
      params
    );
    const wall1 = Bodies.rectangle(
      0,
      canvasSize.height / 2,
      50,
      canvasSize.height,
      params
    );
    const wall2 = Bodies.rectangle(
      canvasSize.width,
      canvasSize.height / 2,
      50,
      canvasSize.height,
      params
    );
    const top = Bodies.rectangle(
      canvasSize.width / 2,
      0,
      canvasSize.width,
      50,
      params
    );
    const wordElements = document.querySelectorAll(".word");
    const wordBodies = [...wordElements].map((elemRef) => {
      const width = elemRef.offsetWidth;
      const height = elemRef.offsetHeight;

      return {
        body: Matter.Bodies.rectangle(canvasSize.width / 2, 0, width, height, {
          render: {
            fillStyle: "transparent"
          }
        }),
        elem: elemRef,
        render() {
          const { x, y } = this.body.position;
          this.elem.style.top = `${y - 20}px`;
          this.elem.style.left = `${x - width / 2}px`;
          this.elem.style.transform = `rotate(${this.body.angle}rad)`;
        }
      };
    });

    // Obtener elementos de palabras y crear cuerpos físicos asociados
    const mouse = Matter.Mouse.create(document.body);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    // Añadir cuerpos a World y ejecutar el motor de simulación
    World.add(engine.world, [
      floor,
      ...wordBodies.map((box) => box.body),
      wall1,
      wall2,
      top,
      mouseConstraint
    ]);
    render.mouse = mouse;
    Runner.run(engine);
    Render.run(render);

    // Función de animación para renderizar los cuerpos
    (function rerender() {
      try {
        wordBodies.forEach((element) => {
          element.render();
        });
        Matter.Engine.update(engine);
        requestAnimationFrame(rerender);
      } catch (error) {
        console.error("Error en rerender:", error);
      }
    })();
  } catch (error) {
    console.error("Error en renderCanvas:", error);
  }
};

// Este manejador de eventos recarga la página cuando se detecta un cambio en el tamaño de la ventana.
const resizeHandler = () => {
  try {
    location.reload();
  } catch (error) {
    console.error("Error en resizeHandler:", error);
  }
};

// Cuando el contenido de la ventana se haya cargado completamente,
// ejecuta las funciones splitWords() y renderCanvas(),
// y agrega un escucha de eventos para cambios en el tamaño de la ventana.
window.addEventListener("DOMContentLoaded", (event) => {
  try {
    splitWords();
    renderCanvas();
    window.addEventListener("resize", resizeHandler);
  } catch (error) {
    console.error("Error en DOMContentLoaded:", error);
  }
});