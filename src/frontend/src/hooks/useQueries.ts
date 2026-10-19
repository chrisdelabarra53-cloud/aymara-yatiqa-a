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
import {
  fetchLesson,
  fetchPhrase,
  fetchPhrases,
  fetchUnit,
  fetchUnits,
  fetchWord,
  fetchWords,
  useContentApi,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

/**
 * Hooks de React Query que envuelven las llamadas al catálogo de contenido
 * del backend. El actor se obtiene una sola vez por hook y las consultas se
 * habilitan únicamente cuando la conexión con el backend está lista.
 */

/** Lista todas las unidades del mapa de aprendizaje. */
export function useUnits() {
  const { actor, isFetching } = useContentApi();
  return useQuery({
    queryKey: ["units"],
    queryFn: () => fetchUnits(actor!),
    enabled: !!actor && !isFetching,
  });
}

/** Devuelve una unidad concreta por su id. */
export function useUnit(id: UnitId) {
  const { actor, isFetching } = useContentApi();
  return useQuery({
    queryKey: ["unit", id],
    queryFn: () => fetchUnit(actor!, id),
    enabled: !!actor && !isFetching,
  });
}

/** Lista todas las palabras del vocabulario. */
export function useWords() {
  const { actor, isFetching } = useContentApi();
  return useQuery({
    queryKey: ["words"],
    queryFn: () => fetchWords(actor!),
    enabled: !!actor && !isFetching,
  });
}

/** Devuelve una palabra concreta por su id. */
export function useWord(id: WordId) {
  const { actor, isFetching } = useContentApi();
  return useQuery({
    queryKey: ["word", id],
    queryFn: () => fetchWord(actor!, id),
    enabled: !!actor && !isFetching,
  });
}

/** Lista todas las frases de ejemplo. */
export function usePhrases() {
  const { actor, isFetching } = useContentApi();
  return useQuery({
    queryKey: ["phrases"],
    queryFn: () => fetchPhrases(actor!),
    enabled: !!actor && !isFetching,
  });
}

/** Devuelve una frase concreta por su id. */
export function usePhrase(id: PhraseId) {
  const { actor, isFetching } = useContentApi();
  return useQuery({
    queryKey: ["phrase", id],
    queryFn: () => fetchPhrase(actor!, id),
    enabled: !!actor && !isFetching,
  });
}

/** Devuelve una lección concreta dentro de una unidad. */
export function useLesson(unitId: UnitId, lessonId: LessonId) {
  const { actor, isFetching } = useContentApi();
  return useQuery({
    queryKey: ["lesson", unitId, lessonId],
    queryFn: () => fetchLesson(actor!, unitId, lessonId),
    enabled: !!actor && !isFetching,
  });
}

export type { Lesson, LessonId, Phrase, PhraseId, Unit, UnitId, Word, WordId };
