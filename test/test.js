const assert = require("assert");
const { Validator, DataType, datatypes } = require("../src");
const {describe, it} = require("mocha");

const email = datatypes.email;

describe("DataType", () => {
	describe("removeRegex", () => {
		it("should remove a regex by its name", () => {
			const copyEmail = new DataType()
				.name("email")
				.addRegex(
					"email",
					/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
				);
			copyEmail.removeRegex("email");
			assert.deepEqual(copyEmail.regexes, {});
		});
	});

	describe("setSearchType", () => {
		it("should set and get the search type", () => {
			const validator = email.searchType("all");
			assert.equal(validator.searchtype, "all");
		});

		it("should throw an error if the search type is not 'one' or 'all'", () => {
			assert.throws(() => {
				new DataType().searchType("invalid_search_type");
			}, Error);
		});
	});
});

describe("Validator", () => {
	describe("setDatatype", () => {
		it("should set the datatype", () => {
			const validator = new Validator().setDatatype(email);
			assert.equal(validator.datatype, email);
		});

		it("should throw an error if the datatype is not an instance of DataType", () => {
			const validator = new Validator();
			assert.throws(() => {
				validator.setDatatype("email");
			}, Error);
		});
	});

	describe("validate", () => {
		it("should return true for a valid email", () => {
			const validator = new Validator().setDatatype(email);
			assert.strictEqual(validator.validate("test@example.com"), true);
		});

		it("should return false for an invalid email", () => {
			const validator = new Validator().setDatatype(email);
			assert.strictEqual(validator.validate("invalid_email"), false);
		});

		it("should return true if any regex in the DataType matches when search type is 'one'", () => {
			const customDataType = new DataType()
				.name("custom")
				.addRegex("pattern1", /^\d+$/)
				.addRegex("pattern2", /^[a-zA-Z]+$/)
				.searchType("one");
			const validator = new Validator().setDatatype(customDataType);
			assert.strictEqual(validator.validate("123"), true);
			assert.strictEqual(validator.validate("abc"), true);
		});

		it("should return false if none of the regexes in the DataType match when search type is 'one'", () => {
			const customDataType = new DataType()
				.name("custom")
				.addRegex("pattern1", /^\d+$/)
				.addRegex("pattern2", /^[a-zA-Z]+$/)
				.searchType("one");
			const validator = new Validator().setDatatype(customDataType);
			assert.strictEqual(validator.validate("123abc"), false);
		});

		it("should return true if all regexes in the DataType match when search type is 'all'", () => {
			const customDataType = new DataType()
				.name("custom")
				.addRegex("pattern1", /^[a-zA-Z0-9]+$/)
				.addRegex("pattern2", /^.{3,}$/)
				.searchType("all");
			const validator = new Validator().setDatatype(customDataType);
			assert.strictEqual(validator.validate("abc123"), true);
		});

		it("should return false if not all regexes in the DataType match when search type is 'all'", () => {
			const customDataType = new DataType()
				.name("custom")
				.addRegex("pattern1", /^[a-zA-Z0-9]+$/)
				.addRegex("pattern2", /^.{6,}$/)
				.searchType("all");
			const validator = new Validator().setDatatype(customDataType);
			assert.strictEqual(validator.validate("abc12"), false);
		});
	});
});
