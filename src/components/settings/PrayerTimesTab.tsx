import { createSignal, For, Show } from "solid-js";

type PrayerTimeRow = {
  "Tarikh Miladi": string;
  "Tarikh Hijri": string;
  Hari: string;
  Imsak: string;
  Subuh: string;
  Syuruk: string;
  Zohor: string;
  Asar: string;
  Maghrib: string;
  Isyak: string;
};

const REQUIRED_HEADERS = [
  "Tarikh Miladi",
  "Tarikh Hijri",
  "Hari",
  "Imsak",
  "Subuh",
  "Syuruk",
  "Zohor",
  "Asar",
  "Maghrib",
  "Isyak",
];

export default function PrayerTimesTab() {
  const [rows, setRows] = createSignal<PrayerTimeRow[]>([]);
  const [error, setError] = createSignal("");
  const [fileName, setFileName] = createSignal("");

  let tableContainerRef: HTMLDivElement | undefined;

  const parseCSV = (text: string) => {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      throw new Error("CSV file is empty.");
    }

    const headers = lines[0].split(",").map((header) => header.trim());

    const isValidFormat =
      headers.length === REQUIRED_HEADERS.length &&
      REQUIRED_HEADERS.every((header, index) => headers[index] === header);

    if (!isValidFormat) {
      throw new Error(
        "Invalid CSV format. Please download the prayer time CSV from e-Solat.",
      );
    }

    const parsedRows: PrayerTimeRow[] = lines.slice(1).map((line) => {
      const values = line.split(",").map((value) => value.trim());

      return {
        "Tarikh Miladi": values[0] || "",
        "Tarikh Hijri": values[1] || "",
        Hari: values[2] || "",
        Imsak: values[3] || "",
        Subuh: values[4] || "",
        Syuruk: values[5] || "",
        Zohor: values[6] || "",
        Asar: values[7] || "",
        Maghrib: values[8] || "",
        Isyak: values[9] || "",
      };
    });

    return parsedRows;
  };

  const handleFileUpload = async (
    event: Event & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    },
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setRows([]);
    setFileName(file.name);

    try {
      const text = await file.text();
      const parsed = parseCSV(text);

      setRows(parsed);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error ? err.message : "Failed to parse CSV file.",
      );
    }
  };

  const clearFile = () => {
    setRows([]);
    setError("");
    setFileName("");

    const input = document.getElementById(
      "prayer-times-csv",
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  };

  // Convert today's date into DD-MMM-YYYY
  const getTodayFormatted = () => {
    const today = new Date();

    const day = String(today.getDate()).padStart(2, "0");

    const month = today.toLocaleString("en-GB", {
      month: "short",
    });

    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const jumpToToday = () => {
    const todayFormatted = getTodayFormatted();

    const rowElement = document.getElementById(`row-${todayFormatted}`);

    if (rowElement) {
      rowElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      rowElement.classList.add("bg-green-700");
      rowElement.classList.add("text-white");
      rowElement.classList.add("font-bold");

      setTimeout(() => {
        rowElement.classList.remove("bg-green-700");
        rowElement.classList.remove("text-white");
        rowElement.classList.remove("font-bold");
      }, 2000);
    } else {
      alert(`Today's date (${todayFormatted}) was not found in the CSV.`);
    }
  };

  return (
    <div class="w-full h-full bg-white text-black p-6 flex flex-col gap-4 overflow-hidden">
      <div class="flex flex-col gap-2 shrink-0">
        <h1 class="text-2xl font-bold">Prayer Times CSV Upload</h1>

        <p class="text-sm text-gray-600">
          Upload CSV exported from{" "}
          <a
            href="https://www.e-solat.gov.my/index.php?siteId=24&pageId=24"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 underline"
          >
            e-Solat
          </a>
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3 shrink-0">
        <input
          id="prayer-times-csv"
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileUpload}
          class="block text-sm"
        />

        <button
          type="button"
          onClick={jumpToToday}
          disabled={rows().length === 0}
          class="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
        >
          Jump To Today
        </button>

        <button
          type="button"
          onClick={clearFile}
          class="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
        >
          Clear
        </button>
      </div>

      <Show when={error()}>
        <div class="rounded border border-red-300 bg-red-50 p-4 text-red-700 shrink-0">
          <p class="font-semibold">Invalid CSV format</p>

          <p class="mt-1 text-sm">{error()}</p>

          <a
            href="https://www.e-solat.gov.my/index.php?siteId=24&pageId=24"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-2 inline-block text-blue-600 underline"
          >
            Download the correct CSV from e-Solat
          </a>
        </div>
      </Show>

      <Show when={rows().length > 0}>
        <div
          ref={tableContainerRef}
          class="flex-1 min-h-0 border rounded overflow-auto"
        >
          <table class="min-w-full border-collapse">
            <thead class="sticky top-0 bg-gray-100 z-10">
              <tr>
                <For each={REQUIRED_HEADERS}>
                  {(header) => (
                    <th class="border px-2 py-1 text-3xl font-semibold whitespace-nowrap">
                      {header}
                    </th>
                  )}
                </For>
              </tr>
            </thead>

            <tbody>
              <For each={rows()}>
                {(row) => (
                  <tr
                    id={`row-${row["Tarikh Miladi"]}`}
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <For each={REQUIRED_HEADERS}>
                      {(header) => (
                        <td class="border px-2 py-1 whitespace-nowrap text-3xl">
                          {row[header as keyof PrayerTimeRow]}
                        </td>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>
    </div>
  );
}
