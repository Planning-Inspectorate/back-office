const machine = require("./household-appeal.machine");

describe("validation state machine", () => {
	it("should have 'submitted' as initial state", () => {
		const initial_state = machine.initialState;
		expect(initial_state.value).toEqual("submitted");
	})
	describe("when starting state is 'submitted'", () => {
		const start_state = "submitted";
		it("should be able to move to invalid", () => {
			const next_state = machine.transition(start_state, "INVALID");
			expect(next_state.value).toEqual("invalid");
			expect(next_state.changed).toEqual(true);
		})

		it("should be able to move to awaiting_validation_info", () => {
			const next_state = machine.transition(start_state, "INFO_MISSING");
			expect(next_state.value).toEqual("awaiting_validation_info");
			expect(next_state.changed).toEqual(true);
		})

		it("should be able to move to valid", () => {
			const next_state = machine.transition(start_state, "VALID");
			expect(next_state.value).toEqual("with_case_officer");
			expect(next_state.changed).toEqual(true);
		})
	})

	describe("when starting state is 'incomplete'", () => {
		const start_state = "awaiting_validation_info";
		it("should be able to move to invalid", () => {
			const next_state = machine.transition(start_state, "INVALID");
			expect(next_state.value).toEqual("invalid");
			expect(next_state.changed).toEqual(true);
		})

		it("should not be able to move to awaiting_validation_info", () => {
			const next_state = machine.transition(start_state, "INFO_MISSING");
			expect(next_state.changed).toEqual(false);
			expect(next_state.value).toEqual(start_state);
		})

		it("should be able to move to valid", () => {
			const next_state = machine.transition(start_state, "VALID");
			expect(next_state.value).toEqual("with_case_officer");
			expect(next_state.changed).toEqual(true);
		})
	})

	describe("when starting state is 'invalid'", () => {
		const start_state = "invalid";
		it("should not be able to move to invalid", () => {
			const next_state = machine.transition(start_state, "INVALID");
			expect(next_state.changed).toEqual(false);
			expect(next_state.value).toEqual(start_state);
		})

		it("should not be able to move to incomplete", () => {
			const next_state = machine.transition(start_state, "INFO_MISSING");
			expect(next_state.changed).toEqual(false);
			expect(next_state.value).toEqual(start_state);
		})

		it("should not be able to move to valid", () => {
			const next_state = machine.transition(start_state, "VALID");
			expect(next_state.changed).toEqual(false);
			expect(next_state.value).toEqual(start_state);
		})
	})

	describe("when starting state is 'valid'", () => {
		const start_state = "with_case_officer";
		it("should not be able to move to invalid", () => {
			const next_state = machine.transition(start_state, "INVALID");
			expect(next_state.changed).toEqual(false);
			expect(next_state.value).toEqual(start_state);
		})

		it("should not be able to move to incomplete", () => {
			const next_state = machine.transition(start_state, "INFO_MISSING");
			expect(next_state.changed).toEqual(false);
			expect(next_state.value).toEqual(start_state);
		})

		it("should not be able to move to valid", () => {
			const next_state = machine.transition(start_state, "VALID");
			expect(next_state.changed).toEqual(false);
			expect(next_state.value).toEqual(start_state);
		})
	})
})
