// @ts-nocheck

export const mapAppealAllocationOut = (allocation, specialisms) =>
	allocation
		? {
				level: allocation.level,
				band: allocation.band,
				specialism: specialisms?.map((s) => s.specialism?.name) || []
		  }
		: null;
