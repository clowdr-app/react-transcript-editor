/**
 * Converts SRT to DraftJs
 */

import {parseSync} from "./parseSync";

interface DraftJsContentBlockParagraph {
    text: string;
    type: "paragraph";
    data: DraftJsContentBlockParagraphData;
    entityRanges: Array<EntitiesRange>;
}

interface DraftJsContentBlockParagraphData {
    speaker: string;
    words: Array<Word>;
    start: number;
}

interface EntitiesRange {
    start: number;
    end: number;
    confidence: number;
    text: string;
    offset: number;
    length: number;
    key: string;
}

interface Paragraph {
    words: Array<Word>;
    text: string;
    speaker: string;
}

interface Word {
    start: number;
    end: number;
    text: string;
    confidence: number;
}

export default function srtToDraft({data: srtText}: {data: string}): Array<DraftJsContentBlockParagraph> {
    const nodes = parseSync(srtText);
    return nodes.map(node => {
        if (node.type !== "cue") {
            return null;
        }

        const nodeWords = node.data.text.split(/\s+/);

        const words = nodeWords.map((nodeWord, idx) => {
            const word: Word = {
                start: ((node.data.start * (nodeWords.length - idx)) + (node.data.end * idx)) / (nodeWords.length * 1000), // weighted average of paragraph start and end times
                end: ((node.data.start * (nodeWords.length - (idx + 1))) + (node.data.end * (idx + 1))) / (nodeWords.length * 1000),
                text: nodeWord,
                confidence: 1,
            };
            return word;
        });

        const entitiesRanges = nodeWords.map((nodeWord, idx) => {
            const entitiesRange: EntitiesRange = {
                start: ((node.data.start * (nodeWords.length - idx)) + (node.data.end * idx)) / (nodeWords.length * 1000),
                end: ((node.data.start * (nodeWords.length - (idx + 1))) + (node.data.end * (idx + 1))) / (nodeWords.length * 1000),
                confidence: 1,
                text: nodeWord,
                offset: idx,
                length: nodeWord.length,
                key: Math.random()
                .toString(36)
                .substring(6),
        };
        return entitiesRange;
        });

        const paragraphData: DraftJsContentBlockParagraphData = {
            speaker: "Speaker 1",
            words: words,
            start: node.data.start / 1000,
        };

        const result: DraftJsContentBlockParagraph = {
            text: node.data.text,
            type: "paragraph",
            data: paragraphData,
            entityRanges: entitiesRanges
        };

        return result;
    }).filter(notEmpty);
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}