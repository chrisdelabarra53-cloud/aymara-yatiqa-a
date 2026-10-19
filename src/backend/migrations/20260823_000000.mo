import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  public type UserRole = {
    #admin;
    #user;
    #guest;
  };

  public type AccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, UserRole>;
  };

  public type UnitId = Nat;
  public type LessonId = Nat;
  public type WordId = Nat;
  public type PhraseId = Nat;
  public type ExerciseId = Nat;

  public type ExerciseType = {
    #selectTranslation;
    #selectAymaraWord;
    #orderWords;
    #fillBlank;
    #matchWordMeaning;
    #trueFalse;
    #multipleChoice;
  };

  public type Exercise = {
    id : ExerciseId;
    exerciseType : ExerciseType;
    prompt : Text;
    options : [Text];
    correctAnswer : Text;
    explanation : Text;
  };

  public type Lesson = {
    id : LessonId;
    title : Text;
    objective : Text;
    vocabulary : [WordId];
    examples : [Text];
    exercises : [Exercise];
    xp : Nat;
    difficulty : Nat;
    mastery : Nat;
  };

  public type Unit = {
    id : UnitId;
    title : Text;
    description : Text;
    locked : Bool;
    lessons : [Lesson];
  };

  public type Word = {
    id : WordId;
    aymara : Text;
    spanish : Text;
    category : Text;
    difficulty : Nat;
    example : Text;
    audio : Text;
    image : ?Text;
    mastery : Nat;
  };

  public type Phrase = {
    id : PhraseId;
    aymara : Text;
    spanish : Text;
    explanation : Text;
    audio : Text;
    difficulty : Nat;
    category : Text;
  };

  type OldActor = {};

  type NewActor = {
    accessControlState : AccessControlState;
    units : List.List<Unit>;
    words : Map.Map<WordId, Word>;
    phrases : Map.Map<PhraseId, Phrase>;
  };

  public func migration(old : OldActor) : NewActor {
    ignore old;

    // --- Words (initial content, subject to review by Aymara speakers) ---
    let wordList = [
      { id = 1; aymara = "jallalla"; spanish = "hola"; category = "saludos"; difficulty = 1; example = "Jallalla, kullaka!"; audio = ""; image = null; mastery = 0 },
      { id = 2; aymara = "juma"; spanish = "tú"; category = "pronombres"; difficulty = 1; example = "Juma kawkirus sarta?"; audio = ""; image = null; mastery = 0 },
      { id = 3; aymara = "naya"; spanish = "yo"; category = "pronombres"; difficulty = 1; example = "Naya aymar yatipxta."; audio = ""; image = null; mastery = 0 },
      { id = 4; aymara = "wawa"; spanish = "niño, niña"; category = "personas"; difficulty = 1; example = "Wawa jachasiraki."; audio = ""; image = null; mastery = 0 },
      { id = 5; aymara = "uta"; spanish = "casa"; category = "lugares"; difficulty = 1; example = "Uta jach'a."; audio = ""; image = null; mastery = 0 },
      { id = 6; aymara = "uma"; spanish = "agua"; category = "naturaleza"; difficulty = 1; example = "Uma suma."; audio = ""; image = null; mastery = 0 },
      { id = 7; aymara = "inti"; spanish = "sol"; category = "naturaleza"; difficulty = 1; example = "Inti phaxsi."; audio = ""; image = null; mastery = 0 },
      { id = 8; aymara = "phaxsi"; spanish = "luna"; category = "naturaleza"; difficulty = 1; example = "Phaxsi arumaxa."; audio = ""; image = null; mastery = 0 },
      { id = 9; aymara = "marka"; spanish = "pueblo, comunidad"; category = "lugares"; difficulty = 1; example = "Marka jach'a."; audio = ""; image = null; mastery = 0 },
      { id = 10; aymara = "qullqi"; spanish = "dinero"; category = "objetos"; difficulty = 1; example = "Qullqi munaña."; audio = ""; image = null; mastery = 0 },
    ];
    let words = Map.empty<WordId, Word>();
    for (w in wordList.values()) { words.add(w.id, w) };

    // --- Phrases (initial content, subject to review) ---
    let phraseList = [
      { id = 1; aymara = "Kamisaraki"; spanish = "¿Cómo estás?"; explanation = "Saludo habitual para preguntar cómo está la otra persona."; audio = ""; difficulty = 1; category = "saludos" },
      { id = 2; aymara = "Waliki"; spanish = "Está bien / de acuerdo"; explanation = "Expresión para indicar conformidad o que todo está bien."; audio = ""; difficulty = 1; category = "saludos" },
      { id = 3; aymara = "Jallalla"; spanish = "¡Viva! / ¡que viva!"; explanation = "Expresión de ánimo y celebración muy usada en el mundo andino."; audio = ""; difficulty = 1; category = "saludos" },
    ];
    let phrases = Map.empty<PhraseId, Phrase>();
    for (p in phraseList.values()) { phrases.add(p.id, p) };

    // --- Lessons for Unit 1 ---
    let lesson1 : Lesson = {
      id = 1;
      title = "Saludos";
      objective = "Aprender a saludar y presentarse en Aymara.";
      vocabulary = [1, 2, 3];
      examples = ["Kamisaraki", "Jallalla", "Waliki"];
      exercises = [
        { id = 1; exerciseType = #selectTranslation; prompt = "¿Qué significa 'jallalla'?"; options = ["hola", "adiós", "gracias", "casa"]; correctAnswer = "hola"; explanation = "'Jallalla' es un saludo y expresión de ánimo." },
        { id = 2; exerciseType = #selectAymaraWord; prompt = "¿Cuál es la palabra Aymara para 'tú'?"; options = ["naya", "juma", "wawa", "uta"]; correctAnswer = "juma"; explanation = "'Juma' significa 'tú'." },
        { id = 3; exerciseType = #trueFalse; prompt = "'Kamisaraki' significa '¿Cómo estás?'"; options = ["Verdadero", "Falso"]; correctAnswer = "Verdadero"; explanation = "Sí, 'Kamisaraki' es un saludo para preguntar cómo está alguien." },
      ];
      xp = 30;
      difficulty = 1;
      mastery = 0;
    };

    let lesson2 : Lesson = {
      id = 2;
      title = "Pronombres";
      objective = "Reconocer los pronombres personales básicos en Aymara.";
      vocabulary = [2, 3];
      examples = ["Naya aymar yatipxta.", "Juma kawkirus sarta?"];
      exercises = [
        { id = 1; exerciseType = #matchWordMeaning; prompt = "Relaciona 'naya' con su significado."; options = ["yo", "tú", "casa", "agua"]; correctAnswer = "yo"; explanation = "'Naya' significa 'yo'." },
        { id = 2; exerciseType = #multipleChoice; prompt = "Selecciona todos los pronombres."; options = ["naya", "juma", "uta", "inti"]; correctAnswer = "naya, juma"; explanation = "'Naya' (yo) y 'juma' (tú) son pronombres." },
      ];
      xp = 25;
      difficulty = 1;
      mastery = 0;
    };

    let lesson3 : Lesson = {
      id = 3;
      title = "Primeras palabras";
      objective = "Ampliar el vocabulario básico de la vida cotidiana.";
      vocabulary = [4, 5, 6, 7, 8, 9, 10];
      examples = ["Uta jach'a.", "Uma suma.", "Inti phaxsi."];
      exercises = [
        { id = 1; exerciseType = #fillBlank; prompt = "Completa: '___' significa 'casa'."; options = ["uta", "uma", "inti", "marka"]; correctAnswer = "uta"; explanation = "'Uta' significa 'casa'." },
        { id = 2; exerciseType = #orderWords; prompt = "Ordena las letras para formar la palabra Aymara de 'agua'."; options = ["u", "m", "a"]; correctAnswer = "uma"; explanation = "La palabra para 'agua' es 'uma'." },
        { id = 3; exerciseType = #selectTranslation; prompt = "¿Qué significa 'inti'?"; options = ["luna", "sol", "piedra", "agua"]; correctAnswer = "sol"; explanation = "'Inti' significa 'sol'." },
      ];
      xp = 35;
      difficulty = 2;
      mastery = 0;
    };

    let unit1 : Unit = {
      id = 1;
      title = "Primeros pasos";
      description = "Introducción al idioma Aymara: saludos, pronombres y vocabulario básico.";
      locked = false;
      lessons = [lesson1, lesson2, lesson3];
    };

    // --- Units 2-15 (locked) ---
    let lockedTitles = [
      ("Saludos", "Saludos y presentaciones cotidianas."),
      ("Presentaciones", "Presentarse y hablar de uno mismo."),
      ("Familia", "Vocabulario de la familia."),
      ("Números", "Los números en Aymara."),
      ("Colores", "Los colores en Aymara."),
      ("Comida", "Alimentos y bebidas."),
      ("Casa", "La casa y sus partes."),
      ("Animales", "Animales del altiplano."),
      ("Naturaleza", "Elementos de la naturaleza."),
      ("Comunidad", "La comunidad y la vida en el ayllu."),
      ("Tiempo", "El tiempo y las estaciones."),
      ("Lugares", "Lugares y ubicaciones."),
      ("Viajes", "Viajes y desplazamientos."),
      ("Conversaciones cotidianas", "Frases para conversaciones diarias."),
    ];

    let units = List.empty<Unit>();
    units.add(unit1);
    var nextId = 2;
    for ((title, desc) in lockedTitles.values()) {
      units.add({ id = nextId; title; description = desc; locked = true; lessons = [] });
      nextId += 1;
    };

    {
      accessControlState = {
        var adminAssigned = false;
        userRoles = Map.empty();
      };
      units;
      words;
      phrases;
    };
  };
};
