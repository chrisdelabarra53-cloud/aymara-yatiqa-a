import List "mo:core/List";
import Map "mo:core/Map";
import Types "../types/content";

module {
  public func listUnits(units : List.List<Types.Unit>) : [Types.Unit] {
    units.toArray()
  };

  public func getUnit(units : List.List<Types.Unit>, id : Types.UnitId) : ?Types.Unit {
    units.find(func u = u.id == id)
  };

  public func getLesson(units : List.List<Types.Unit>, unitId : Types.UnitId, lessonId : Types.LessonId) : ?Types.Lesson {
    switch (units.find(func u = u.id == unitId)) {
      case (?u) { u.lessons.find(func l = l.id == lessonId) };
      case null { null };
    }
  };

  public func listWords(words : Map.Map<Types.WordId, Types.Word>) : [Types.Word] {
    words.values().toArray()
  };

  public func getWord(words : Map.Map<Types.WordId, Types.Word>, id : Types.WordId) : ?Types.Word {
    words.get(id)
  };

  public func listPhrases(phrases : Map.Map<Types.PhraseId, Types.Phrase>) : [Types.Phrase] {
    phrases.values().toArray()
  };

  public func getPhrase(phrases : Map.Map<Types.PhraseId, Types.Phrase>, id : Types.PhraseId) : ?Types.Phrase {
    phrases.get(id)
  };
};
