/**
 * Contenido de la presentación.
 *
 * Basado en Resumen.txt (capítulo "Adaptación"). El texto se reescribe a
 * formato slide: frases cortas y viñetas. Se conservan los ejemplos, las
 * referencias y la voz original.
 */

export type FerrisAsset =
  | 'cuddlyferris'
  | 'flat-happy'
  | 'flat-gesture'
  | 'flat-orig'
  | 'corro';

export type SlideBlock =
  | { kind: 'text'; value: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'quote'; value: string; author?: string }
  | { kind: 'highlight'; label: string; value: string }
  | { kind: 'contrast'; bad: string; good: string }
  | { kind: 'steps'; items: string[] }
  | { kind: 'note'; value: string };

export interface Slide {
  /** id estable, se usa en el ancla del índice */
  id: string;
  /** título visible */
  title: string;
  /** texto pequeño sobre el título */
  kicker?: string;
  /** agrupa slides en el índice lateral */
  section?: string;
  blocks: SlideBlock[];
  /** asset de Ferris para esta slide */
  ferris: FerrisAsset;
  /** frase en la burbuja de Ferris (solo en algunas slides) */
  bubble?: string;
  /** lado hacia el que inclina el cuerpo: -1 izquierda, 1 derecha */
  tilt?: -1 | 0 | 1;
}

export interface Section {
  name: string;
  slides: Slide[];
}

export const SECTIONS: Section[] = [
  {
    name: 'Apertura',
    slides: [
      {
        id: 'portada',
        title: 'Adaptación',
        kicker: 'Resumen del capítulo',
        ferris: 'flat-gesture',
        blocks: [
          { kind: 'text', value: 'La habilidad que te permite sostenerte en el tiempo' },
        ],
      },
      {
        id: 'indice',
        title: 'Contenido',
        ferris: 'flat-happy',
        blocks: [],
      },
      {
        id: 'disrumpir',
        title: 'Disrumpir o ser disrupto',
        kicker: 'El consejo del mundillo',
        ferris: 'flat-gesture',
        tilt: -1,
        blocks: [
          { kind: 'quote', value: 'Disrumpir el mercado o ser disrupto.' },
          { kind: 'quote', value: 'Muévete rápido, rompe cosas.' },
          { kind: 'note', value: 'La velocidad del Silicon Valley tiene una regla: la que rompe el mercado es la que sobrevive.' },
        ],
      },
    ],
  },
  {
    name: 'Velocidad',
    slides: [
      {
        id: 'competidores',
        title: 'Los competidores no avisan',
        ferris: 'corro',
        tilt: 1,
        blocks: [
          { kind: 'text', value: 'Los competidores salen de la nada. No te los esperes, prepárate para ellos.' },
          { kind: 'highlight', label: 'Regla práctica', value: 'Pon tu MVP afuera desde ayer.' },
          { kind: 'text', value:'Pero ten cuidado, correr puede significar tropezar'}
        ],
      },
      {
        id: 'no-crecer',
        title: 'No todo debe crecer a la vez',
        kicker: 'Crecer de más es tan peligroso como no crecer.',
        ferris: 'flat-orig',
        tilt: -1,
        blocks: [
          { kind: 'text', value: 'El software de aviones y de vuelos espaciales no escala igual: cada pieza tiene su propio ritmo.' },
          { kind: 'note', value: 'Pero incluso en este mundo existen excepciones.' },
        ],
      },
      {
        id: 'spirit-rover',
        title: 'Spirit Rover: un hotfix desde Marte',
        ferris: 'flat-gesture',
        tilt: 1,
        blocks: [
          { kind: 'text', value: 'El rover tuvo que desplegar un hotfix estando en Marte.' },
          { kind: 'list', items: [
            'La distancia obliga a iterar sin poder tocar el hardware.',
            'El cambio se validó a distancia, sobre el código ya en órbita.',
          ] },
        ],
      },
      {
        id: 'curiosity',
        title: 'Curiosity: sin actualizaciones en vuelo',
        ferris: 'cuddlyferris',
        tilt: -1,
        bubble: 'Quizás ahora sea más fácil conseguir RAM en el espacio que aquí.',
        blocks: [
          { kind: 'text', value: 'Descargó el programa de vuelo y aterrizaje para cargar el de operaciones terrestres.' },
          { kind: 'list', items: [
            'No había actualizaciones de RAM disponibles en vuelo.',
            'El plan se decidió antes de despegar, no durante el vuelo.',
          ] },
        ],
      },
      {
        id: 'deming',
        title: 'El ciclo Deming / Shewhart',
        ferris: 'flat-orig',
        tilt: 1,
        blocks: [
          { kind: 'text', value: 'Para conseguir esa velocidad hace falta entrar en el ciclo.' },
          { kind: 'steps', items: ['Plan', 'Do', 'Check', 'Act'] },
        ],
      },
      {
        id: 'comunicacion',
        title: 'Empresas grandes: comunicación efectiva',
        ferris: 'flat-happy',
        blocks: [
          { kind: 'text', value: 'Mantener el contacto con cada una de las partes y hacer la comunicación lo más efectiva posible para evitar.' },
        ],
      },
      {
        id: 'adaptarse',
        title: 'El efecto final',
        ferris: 'flat-happy',
        tilt: 1,
        blocks: [
          { kind: 'text', value: 'Decidir más rápido mejora el tiempo de respuesta a tus competidores y acelera la iteración constantemente.' },
          { kind: 'highlight', label: 'Consecuencia', value: 'Eventualmente hará que sea la competencia la que se adapte a ti.' },
        ],
      },
    ],
  },
  {
    name: 'Trashing',
    slides: [
      {
        id: 'trashing',
        title: 'Cuidado: el trashing',
        kicker: 'Acelerar sin leer',
        ferris: 'cuddlyferris',
        tilt: -1,
        bubble: 'Si vas muy rápido en una curva te vas al barranco.',
        blocks: [
          { kind: 'text', value: 'No solo debes acelerar el desarrollo.' },
          { kind: 'list', items: [
            'Tu propuesta sale tan rápido que no alcanzaste a recopilar feedback útil.',
            'El código nuevo queda mal o no cumple con lo que los usuarios te dijeron.',
          ] },
          { kind: 'note', value: 'Aceleras la salida, pero te saltas el paso que hace que la salida sirva.' },
        ],
      },
    ],
  },
  {
    name: 'Plataforma',
    slides: [
      {
        id: 'plataforma-importa',
        title: 'La plataforma importa tanto como tu software',
        ferris: 'flat-orig',
        tilt: 1,
        blocks: [
          { kind: 'text', value: 'La plataforma donde corres tu software es igual de importante que el software mismo.' },
          { kind: 'list', items: [
            'Antes: cada compañía tenía su equipo de desarrollo y su equipo de operaciones, dedicado a montar toda la infraestructura.',
            'Hoy: con virtualización y cloud, crear plataformas se volvió programable y mucho más fácil.',
          ] },
        ],
      },
      {
        id: 'plataforma-base',
        title: 'La base es del equipo de plataforma',
        ferris: 'flat-orig',
        tilt: -1,
        bubble: 'Te dan los ladrillos y aplanan el terreno. Tú haz la casa',
        blocks: [
          { kind: 'text', value: 'Tu equipo de plataforma no debe implementar todo lo que tu aplicación necesita: debe crear la base sobre la cual tú construyes.' },
        ],
      },
      {
        id: 'tracking',
        title: 'Ejemplo: el tracking',
        ferris: 'flat-gesture',
        tilt: 1,
        blocks: [
          { kind: 'text', value: 'Tu equipo debe colocar tracking en la aplicación, mediante logs en archivos y base de datos.' },
          { kind: 'contrast', bad: 'Que el equipo de plataforma integre todo de acuerdo a tu app.', good: 'Que el equipo de plataforma te de lo necesario para persistir los logs, tú solo consumes.' },
        ],
      },
      {
        id: 'devops-falacia',
        title: 'Lección: "La falacia del equipo DevOps"',
        ferris: 'cuddlyferris',
        tilt: -1,
        bubble: '¿DevOps o un nombre nuevo para el equipo de plataforma?',
        blocks: [
          { kind: 'text', value: 'El "DevOps" moderno es una mentira: es un nombre enaltecido del equipo de plataforma.' },
          { kind: 'list', items: [
            'O es una especie de pegamento.',
            'Y el pegamento rompe con la idea primordial del DevOps.',
          ] },
        ],
      },
    ],
  },
  {
    name: 'Despliegue',
    slides: [
      {
        id: 'codo-a-codo',
        title: 'Plataforma y desarrollo, codo a codo',
        ferris: 'flat-happy',
        tilt: 1,
        blocks: [
          { kind: 'text', value: 'El camino de desplegar debería ser mucho más sencillo.' },
          { kind: 'highlight', label: 'La analogía', value: 'Desplegar debería ser tan rutinario como cortarse el cabello: lo haces 6 o 7 veces al año y no es relevante.' },
        ],
      },
      {
        id: 'nasa',
        title: 'Caso NASA: el deploy que no podía fallar',
        ferris: 'cuddlyferris',
        tilt: -1,
        bubble: 'Revisaban, tardaban, iban atrasados… y el riesgo subía.',
        blocks: [
          { kind: 'text', value: 'Los ingenieros de la NASA sufrían porque el deploy no podía salir mal.' },
          { kind: 'list', items: [
            'Entonces lo revisaban.',
            'Se tardaban en revisarlo.',
            'Y como ya iban más atrasados, con menos razón debía salir mal, así que volvían a revisarlo.',
          ] },
        ],
      },
      {
        id: 'deploy-sin-esfuerzo',
        title: 'El criterio',
        ferris: 'flat-gesture',
        tilt: 1,
        blocks: [
          { kind: 'highlight', label: 'Regla', value: 'El despliegue debe ser algo sin esfuerzo, automatizado y estandarizado. Punto.' },
        ],
      },
      {
        id: 'blue-green',
        title: 'Blue / Green deployment',
        ferris: 'flat-orig',
        blocks: [
          { kind: 'text', value: 'Máquinas en dos pools: uno con el código de producción y otro con el código a implementar.' },
          { kind: 'steps', items: [
            'El pool nuevo replica la información.',
            'Si todo se ve bien, esas máquinas pasan a producción.',
            'Y son las que atienden las peticiones reales.',
          ] },
        ],
      },
      {
        id: 'service-extinction',
        title: 'Service extinction',
        kicker: 'Dejar morir lo que no sirve',
        ferris: 'cuddlyferris',
        tilt: -1,
        bubble: 'A morir a morir, que se seque y a morir.',
        blocks: [
          { kind: 'text', value: 'Aquí preguntémosle a Google y su infinidad de productos muertos. Dejaron morir literalmente el "futuro de los videojuegos".' },
          { kind: 'highlight', label: 'Decisión', value: 'Si algo no deja, es mejor matarlo y centrar los recursos que tenía en terapia intensiva en algo más rentable.' },
        ],
      },
    ],
  },
  {
    name: 'Equipos',
    slides: [
      {
        id: 'equipos-autosustentables',
        title: 'Equipos autosustentables',
        ferris: 'flat-happy',
        tilt: 1,
        blocks: [
          { kind: 'text', value: 'Así como es bueno tener solo los servicios autosustentables, que los equipos lo sean también es lo ideal.' },
          { kind: 'contrast', bad: 'Equipos inmensos con 10 especialistas de cada cosa.', good: 'Un equipo que puedas alimentar con una olla mediana de pozole (8 personas aprox).' },
          { kind: 'list', items: [
            'La comunicación dentro del equipo es rápida.',
            'Nadie espera a que otra persona dependa de la respuesta de alguien más.',
            'Debe ser un equipo multidisciplinario que puede rascarse su propia espalda.',
          ] },
        ],
      },
      {
        id: 'eficiencia-flexibilidad',
        title: 'Eficiencia vs. flexibilidad',
        ferris: 'cuddlyferris',
        tilt: -1,
        bubble: 'Si una manada de ferris cortaramos los cables de AWS, ¿qué despliega tu app?',
        blocks: [
          { kind: 'text', value: 'Con un equipo pequeño y comunicándose bien, la eficiencia hay que cuidarla: no siempre conviene.' },
          { kind: 'contrast', bad: 'Una GitHub Action que despliega en Kubernetes hosteado en AWS en cada commit. ¡Estás atado!', good: 'Un script en bash que levanta una máquina virtual en cualquier servidor con VMware. Configuras la máquina y eres flexible.' },
          { kind: 'note', value: 'Lo que ganaste en eficiencia lo perdiste en flexibilidad. Si mañana un montón de cangrejos corta los cables de internet de AWS, estás frito.' },
        ],
      },
    ],
  },
  {
    name: 'Arquitectura',
    slides: [
      {
        id: 'arquitectura-cambia',
        title: 'Cambia la arquitectura junto con la organización',
        ferris: 'flat-orig',
        tilt: 1,
        blocks: [
          { kind: 'highlight', label: 'Conclusión', value: 'No podemos cambiar la organización sola: debe cambiar con ella la arquitectura.' },
        ],
      },
      {
        id: 'capas',
        title: 'Capas: el acoplamiento horizontal',
        ferris: 'flat-orig',
        tilt: -1,
        blocks: [
          { kind: 'text', value: 'Una de las formas más usadas para separar responsabilidades es por capas.' },
          { kind: 'list', items: ['Capa del usuario', 'Capa de controlador', 'Capa de dominio', 'Capas de servicios técnicos'] },
          { kind: 'note', value: 'Esto provoca muchas veces que los componentes crezcan horizontalmente, quedando acoplados unos con otros.' },
        ],
      },
      {
        id: 'vertical',
        title: 'Módulos verticales',
        ferris: 'flat-gesture',
        tilt: 1,
        blocks: [
          { kind: 'text', value: 'Encerrar cada módulo o funcionalidad de forma vertical: cada uno como si fuera un microservicio, aunque no lo es.' },
          { kind: 'highlight', label: 'Beneficio', value: 'De esta forma es más fácil expandir la funcionalidad del software.' },
        ],
      },
      {
        id: 'contexto-implicito',
        title: 'El contexto implícito en tu código',
        ferris: 'cuddlyferris',
        tilt: -1,
        bubble: 'Item… o ItemIdWebPolicies. El primero te deja patinando.',
        blocks: [
          { kind: 'text', value: 'No es lo mismo leer un nombre que otro. El contexto implícito importa tanto como la estructura.' },
          { kind: 'contrast', bad: 'Item', good: 'ItemIdWebPolicies' },
          { kind: 'note', value: 'No es lo mismo una variable llamada Item que otra llamada ItemIdWebPolicies. El primero te deja patinando.' },
        ],
      },
      {
        id: 'paredes-lisas',
        title: 'Paredes lisas',
        ferris: 'flat-happy',
        tilt: 1,
        blocks: [
          { kind: 'text', value: 'Debes dejar paredes lisas, listas para expandir, y separar tus componentes.' },
          { kind: 'list', items: [
            'Desacoplar para poder crecer sin arrastrarlo todo.',
            'Nombrar con contexto explícito.',
            'Adaptar la arquitectura junto con la organización.',
          ] },
          { kind: 'highlight', label: 'Adaptación', value: 'Eventualmente hará que sea la competencia la que se adapte a ti.' },
        ],
      },
    ],
  },
  {
    name: 'Datos y eventos',
    slides: [
      {
        id: 'arquitectura-informacion',
        title: 'Arquitectura de la información',
        kicker: 'Escoge bien dónde vive cada cosa',
        ferris: 'flat-orig',
        tilt: 1,
        blocks: [
          { kind: 'text', value: 'Escoger una buena base de datos es parte del diseño. No todo tiene que caber con calzador en una base SQL.' },
          { kind: 'list', items: [
            'Si guardas conexiones entre hechos, quizá una base orientada a grafos sea mejor opción.',
            'El suceso de cada hecho, en una base SQL de hechos históricos.',
            'El contenido multimedia, en una base para blobs.',
          ] },
          { kind: 'highlight', label: 'Conclusión', value: 'Nuestro trabajo también es modelar la información, no solo el código.' },
        ],
      },
      {
        id: 'tipos-evento',
        title: 'Tres clases de eventos',
        kicker: 'Mensajes y eventos',
        ferris: 'flat-gesture',
        tilt: -1,
        blocks: [
          { kind: 'text', value: 'Hay que conocer los eventos y saber cuál de estos tres estás mandando.' },
          { kind: 'list', items: [
            'Evento de notificación: un fire and forget, se manda y no esperas nada.',
            'Evento de transferencia de estados: replican entidades o sus partes para que otros hagan su trabajo.',
            'Fuente de eventos: eventos grabados que describen el cambio.',
          ] },
        ],
      },
      {
        id: 'registro-eventos',
        title: 'El registro de eventos',
        ferris: 'cuddlyferris',
        tilt: 1,
        bubble: 'Fire and forget… pero con memoria.',
        blocks: [
          { kind: 'highlight', label: 'Ventaja', value: 'Tener un registro te da la capacidad de ver lo que ha ocurrido y revisarlo desde varios puntos.' },
          { kind: 'text', value: 'Por eso se habla de CQRS: los eventos suelen encontrarse en la parte de los comandos.' },
        ],
      },
      {
        id: 'ids-de-la-app',
        title: 'Las apps controlan sus identificadores',
        kicker: 'Por ningún motivo los crees tú',
        ferris: 'cuddlyferris',
        tilt: -1,
        bubble: 'Si el id lo inventas tú, ya empezaste mal.',
        blocks: [
          { kind: 'text', value: 'Nunca decidas crear identificadores fuera de la aplicación.' },
          { kind: 'contrast', bad: 'Tú le das un id al cliente y ese id se liga a un catálogo.', good: 'La app genera el id y liga cliente ↔ catálogo por su cuenta.' },
          { kind: 'note', value: 'El ejemplo del libro: un id generado a mano y atado a un catálogo no sirve de nada.' },
        ],
      },
      {
        id: 'urls',
        title: 'Las URLs son grandiosas',
        ferris: 'flat-happy',
        tilt: 1,
        bubble: 'Dos es un número ridículo. Aquí hay 0, 1 y muchos.',
        blocks: [
          { kind: 'text', value: 'Las URLs sirven para diferenciar mejor los servicios. Ejemplo: un catálogo nuevo en su propia base de datos.' },
          { kind: 'steps', items: ['Los items nuevos van al catálogo "ab".', 'Los viejos se quedan donde estaban.', 'Y mañana, "abc" no necesita migración.'] },
          { kind: 'highlight', label: 'La idea', value: 'Con una URL resuelves cosas que aún no existen: solo descifras la URL.' },
        ],
      },
      {
        id: 'pluralidad',
        title: 'Abraza la pluralidad',
        ferris: 'flat-gesture',
        tilt: -1,
        blocks: [
          { kind: 'text', value: 'Un cliente no es una definición de persona: es una faceta de la misma.' },
          { kind: 'list', items: [
            'Para el área de ventas es una cosa.',
            'Para redes sociales es otra.',
            'Generalizar es Abraza la pluralidad, no enclaustrarla.',
          ] },
        ],
      },
      {
        id: 'fuga-conceptos',
        title: 'Evita fuga de conceptos',
        ferris: 'flat-orig',
        tilt: 1,
        blocks: [
          { kind: 'text', value: 'Se creó un price point que agrupaba el precio de varias canciones. Querías cambiar toda la lista, así que solo cambiabas el valor al que apuntaba.' },
          { kind: 'note', value: 'El problema: todos quisieron aprovechar la idea y eso causó acoplamiento semántico.' },
        ],
      },
    ],
  },
];

export const SLIDES: Slide[] = SECTIONS.flatMap((section) =>
  section.slides.map((slide) => ({ ...slide, section: slide.section ?? section.name }))
);

/** Índice plano de cada slide por su id, para la navegación. */
export const SLIDE_IDS = SLIDES.map((s) => s.id);
