import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Exercise {
    id: ExerciseId;
    explanation: string;
    correctAnswer: string;
    exerciseType: ExerciseType;
    prompt: string;
    options: Array<string>;
}
export type LessonId = bigint;
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export type PhraseId = bigint;
export interface Phrase {
    id: PhraseId;
    audio: string;
    difficulty: bigint;
    explanation: string;
    spanish: string;
    category: string;
    aymara: string;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export interface Unit {
    id: UnitId;
    title: string;
    locked: boolean;
    description: string;
    lessons: Array<Lesson>;
}
export interface Lesson {
    id: LessonId;
    xp: bigint;
    mastery: bigint;
    title: string;
    objective: string;
    difficulty: bigint;
    exercises: Array<Exercise>;
    vocabulary: Array<WordId>;
    examples: Array<string>;
}
export interface Cell {
    value: Value;
    name: string;
}
export type ExerciseId = bigint;
export interface Word {
    id: WordId;
    mastery: bigint;
    audio: string;
    difficulty: bigint;
    example: string;
    spanish: string;
    category: string;
    aymara: string;
    image?: string;
}
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export type WordId = bigint;
export type UnitId = bigint;
export enum ExerciseType {
    selectAymaraWord = "selectAymaraWord",
    orderWords = "orderWords",
    selectTranslation = "selectTranslation",
    fillBlank = "fillBlank",
    multipleChoice = "multipleChoice",
    matchWordMeaning = "matchWordMeaning",
    trueFalse = "trueFalse"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    execute(qJson: string): Promise<Result>;
    getCallerUserRole(): Promise<UserRole>;
    getLesson(unitId: UnitId, lessonId: LessonId): Promise<Lesson | null>;
    getPhrase(id: PhraseId): Promise<Phrase | null>;
    getPhrases(): Promise<Array<Phrase>>;
    getUnit(id: UnitId): Promise<Unit | null>;
    getUnits(): Promise<Array<Unit>>;
    getWord(id: WordId): Promise<Word | null>;
    getWords(): Promise<Array<Word>>;
    isCallerAdmin(): Promise<boolean>;
    schema(): Promise<string>;
}
