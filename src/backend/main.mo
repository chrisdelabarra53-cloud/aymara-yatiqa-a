import List "mo:core/List";
import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import Types "types/content";
import ContentApi "mixins/content-api";
// OQL resolver modules — imported top-level so the entity builder chain resolves
import Entity "mo:caffeineai-oql/Entity";
import ListEntity "mo:caffeineai-oql/ListEntity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import BoolValue "mo:caffeineai-oql/BoolValue";

actor {
  let accessControlState : AccessControl.AccessControlState;
  let units : List.List<Types.Unit>;
  let words : Map.Map<Types.WordId, Types.Word>;
  let phrases : Map.Map<Types.PhraseId, Types.Phrase>;

  include MixinAuthorization(accessControlState, null);
  include ContentApi(units, words, phrases);
  include Expose({
    entities = [
      // units — manual mode: Unit carries a `lessons` collection field, so the
      // scalar columns are declared explicitly (lesson count as a queryable Nat).
      units.toEntityManual("unit", "Unit", "id")
        .payload("id", func u = u.id)
        .payload("title", func u = u.title)
        .payload("description", func u = u.description)
        .payload("locked", func u = u.locked)
        .payload("lessonCount", func u = u.lessons.size())
        .public_()
        .build(),
      // words — manual mode: Word carries an `image : ?Text` option field, so
      // the option is collapsed to a sentinel empty string (one Value variant).
      words.toEntityManual("word", "Word", "id")
        .payload("id", func w = w.id)
        .payload("aymara", func w = w.aymara)
        .payload("spanish", func w = w.spanish)
        .payload("category", func w = w.category)
        .payload("difficulty", func w = w.difficulty)
        .payload("example", func w = w.example)
        .payload("audio", func w = w.audio)
        .payload("image", func w = w.image ?? "")
        .payload("mastery", func w = w.mastery)
        .public_()
        .build(),
      // phrases — auto-derived: Phrase is an all-primitive record.
      phrases.toEntity("phrase", "Phrase", "id")
        .sample({ id = 0; aymara = ""; spanish = ""; explanation = ""; audio = ""; difficulty = 0; category = "" })
        .public_()
        .build(),
    ];
  });
};
