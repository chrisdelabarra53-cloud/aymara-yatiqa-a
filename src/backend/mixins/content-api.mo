import List "mo:core/List";
import Map "mo:core/Map";
import Types "../types/content";
import ContentLib "../lib/content";

mixin (
  units : List.List<Types.Unit>,
  words : Map.Map<Types.WordId, Types.Word>,
  phrases : Map.Map<Types.PhraseId, Types.Phrase>,
) {
  public query func getUnits() : async [Types.Unit] {
    ContentLib.listUnits(units)
  };

  public query func getUnit(id : Types.UnitId) : async ?Types.Unit {
    ContentLib.getUnit(units, id)
  };

  public query func getLesson(unitId : Types.UnitId, lessonId : Types.LessonId) : async ?Types.Lesson {
    ContentLib.getLesson(units, unitId, lessonId)
  };

  public query func getWords() : async [Types.Word] {
    ContentLib.listWords(words)
  };

  public query func getWord(id : Types.WordId) : async ?Types.Word {
    ContentLib.getWord(words, id)
  };

  public query func getPhrases() : async [Types.Phrase] {
    ContentLib.listPhrases(phrases)
  };

  public query func getPhrase(id : Types.PhraseId) : async ?Types.Phrase {
    ContentLib.getPhrase(phrases, id)
  };
};
