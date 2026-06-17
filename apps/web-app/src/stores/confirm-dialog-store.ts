import { create } from "zustand";

interface ConfirmOptions {
	title: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "default" | "destructive";
}

interface ConfirmStore extends ConfirmOptions {
	open: boolean;
	resolve: ((value: boolean) => void) | null;

	show: (options: ConfirmOptions) => Promise<boolean>;
	close: (value: boolean) => void;
}

export const useConfirmDialogStore = create<ConfirmStore>((set, get) => ({
	open: false,
	title: "",
	description: "",
	confirmText: "Confirm",
	cancelText: "Cancel",
	variant: "default",
	resolve: null,

	show: (options) =>
		new Promise<boolean>((resolve) => {
			set({
				...options,
				open: true,
				resolve,
			});
		}),

	close: (value) => {
		const resolve = get().resolve;

		resolve?.(value);

		set({
			open: false,
			resolve: null,
		});
	},
}));

export function confirm(options: {
	title: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "default" | "destructive";
}) {
	return useConfirmDialogStore.getState().show(options);
}
