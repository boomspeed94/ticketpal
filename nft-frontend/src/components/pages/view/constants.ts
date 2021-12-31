export const ViewTabs = ['Info', 'Owners', 'History'] as const;
export type ViewTabType = typeof ViewTabs[number];
