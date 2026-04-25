import type { AppEvent } from "@/types/app-event";
import { useSettings } from "./settings";

type EventGroups = {
  today: AppEvent[];
  tomorrow: AppEvent[];
};

export async function loadTodayAndTomorrow(): Promise<EventGroups> {
  const { appEvents } = useSettings();

  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfToday.getDate() + 1);

  const startOfDayAfterTomorrow = new Date(startOfTomorrow);
  startOfDayAfterTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const todayEvents: AppEvent[] = [];
  const tomorrowEvents: AppEvent[] = [];

  for (const event of appEvents || []) {
    const eventDate = new Date(event.date); // 👈 adjust if your field name differs

    if (eventDate >= startOfToday && eventDate < startOfTomorrow) {
      todayEvents.push(event);
    } else if (
      eventDate >= startOfTomorrow &&
      eventDate < startOfDayAfterTomorrow
    ) {
      tomorrowEvents.push(event);
    }
  }

  return {
    today: todayEvents,
    tomorrow: tomorrowEvents,
  };
}
