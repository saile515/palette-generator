import "./style.css";
import { palette } from "./color-ui.ts";
import { create_kpl } from "./exporters/kpl.ts";
import { saveAs } from "file-saver";

const export_button = document.getElementById("export")!;
const export_type_selector = document.getElementById(
  "export-type",
) as HTMLSelectElement;
const palette_name_element = document.getElementById(
  "name",
) as HTMLInputElement;

export_button.addEventListener("click", async () => {
  const type = export_type_selector.value;

  switch (type) {
    case "kpl":
      saveAs(
        await create_kpl(palette, palette_name_element.value),
        `${palette_name_element.value}.kpl`,
      );
      break;
    default:
      break;
  }
});
