import { createActor } from "@/backend";
import type {
  Lesson,
  LessonId,
  Phrase,
  PhraseId,
  Unit,
  UnitId,
  Word,
  WordId,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";

/**
 * Cliente del catálogo de contenido del backend.
 *
 * Cada función devuelve el actor listo para llamar a los métodos de lectura
 * del catálogo (unidades, lecciones, palabras y frases). El actor se obtiene
 * mediante `useActor(createActor)` y solo está disponible cuando la conexión
 * con el backend está lista.
 */
export interface ContentActor {
  actor: ReturnType<typeof createActor> | null;
  isFetching: boolean;
}

function useContentActor(): ContentActor {
  const { actor, isFetching } = useActor(createActor);
  return { actor, isFetching };
}

/** Devuelve el actor del catálogo de contenido. */
export function useContentApi(): ContentActor {
  return useContentActor();
}

/** Lista todas las unidades del mapa de aprendizaje. */
export async function fetchUnits(
  actor: NonNullable<ContentActor["actor"]>,
): Promise<Unit[]> {
  return actor.getUnits();
}

/** Devuelve una unidad concreta por su id. */
export async function fetchUnit(
  actor: NonNullable<ContentActor["actor"]>,
  id: UnitId,
): Promise<Unit | null> {
  return actor.getUnit(id);
}

/** Lista todas las palabras del vocabulario. */
export async function fetchWords(
  actor: NonNullable<ContentActor["actor"]>,
): Promise<Word[]> {
  return actor.getWords();
}

/** Devuelve una palabra concreta por su id. */
export async function fetchWord(
  actor: NonNullable<ContentActor["actor"]>,
  id: WordId,
): Promise<Word | null> {
  return actor.getWord(id);
}

/** Lista todas las frases de ejemplo. */
export async function fetchPhrases(
  actor: NonNullable<ContentActor["actor"]>,
): Promise<Phrase[]> {
  return actor.getPhrases();
}

/** Devuelve una frase concreta por su id. */
export async function fetchPhrase(
  actor: NonNullable<ContentActor["actor"]>,
  id: PhraseId,
): Promise<Phrase | null> {
  return actor.getPhrase(id);
}

/** Devuelve una lección concreta dentro de una unidad. */
export async function fetchLesson(
  actor: NonNullable<ContentActor["actor"]>,
  unitId: UnitId,
  lessonId: LessonId,
): Promise<Lesson | null> {
  return actor.getLesson(unitId, lessonId);
}
