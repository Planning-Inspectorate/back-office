export namespace Pagination {
	export interface Info {
		resultsPerPage: SizeOption[];
		paginationLinks: Links;
		showing: Showing;
	}

	export interface SizeOption {
		size: number;
		link: string;
		active: boolean;
	}

	export interface Showing {
		of: number;
		from: number;
		to: number;
	}

	export interface Links {
		next: Link;
		previous: Link;
		items: any[];
	}

	export type Link = { href: string } | string;
}
