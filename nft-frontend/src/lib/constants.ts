export type UserType = 'Owner' | 'Creator';
// export const UserTypeOptions = ['Sellers', 'Buyers'];
// export const DateTypeOptions = ['1 day', '7 days', '30 days'];

export const VideoTypes = ['video/mp3', 'video/mp4', 'video'];
const VideoTypeConst = ['video/mp3', 'video/mp4', 'video'] as const;
export type VideoType = typeof VideoTypeConst[number];
