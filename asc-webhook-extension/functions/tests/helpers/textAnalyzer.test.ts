import { findHashtag, analyzeSentiment } from "../../src/helpers/textAnalyzer"

describe("findHashtag", () => {
    it("should detect hashtag successfully", () => {
        console.log(findHashtag("This is a test function with #hashtag available #multipleone"));
        expect(findHashtag("This is a test function with #hashtag available #multipleone")).toStrictEqual(["#hashtag", "#multipleone"]);
    });
    it("should return empty array", () => {
        expect(findHashtag("This has no hashtag")).toBe(null);
    });
});

describe("analyzeSentiment", () => {
    it("should return negative sentiment", () => {
        expect(analyzeSentiment("This is very bad", "English")).toBeLessThan(0);
    });
    it("should return positive sentiment", () => {
        expect(analyzeSentiment("I love this", "English")).toBeGreaterThan(0);
    });
    it("should return zero sentiment on foreign language", () => {
        expect(analyzeSentiment("ทดสอบภาษาไทย", "English")).toEqual(0);
    });
    it("should return zero sentiment on unsupported language", () => {
        expect(analyzeSentiment("ทดสอบภาษาไทย", "Thai" as AmitySupportedLanguage)).toEqual(0);
    });
});
