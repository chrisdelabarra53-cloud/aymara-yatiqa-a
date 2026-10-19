module {
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
};
