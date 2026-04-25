export type AppEvent = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  title: string;
  desc?: string;
  speaker?: string;
  speakerCode?: string;
};
