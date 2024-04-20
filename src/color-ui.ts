const palette_size_element = document.getElementById(
  "palette-size",
) as HTMLInputElement;
const lightness_equation_element = document.getElementById(
  "lightness-equation",
) as HTMLInputElement;
const chroma_equation_element = document.getElementById(
  "chroma-equation",
) as HTMLInputElement;
const hue_equation_element = document.getElementById(
  "hue-equation",
) as HTMLInputElement;
const preview_container_element = document.getElementById("preview-container")!;
const palette_container_element = document.getElementById("palette-container")!;
const add_colors_element = document.getElementById(
  "add-colors",
) as HTMLButtonElement;
import Color from "colorjs.io";

export const palette: Color[][] = [];

let current_row: Color[];

const update_preview_on_change = (element: HTMLElement) => {
  element.addEventListener("input", update_preview);
};

export const create_palette_row = (
  palette_size: number,
  lightness_equation: string,
  chroma_equation: string,
  hue_equation: string,
) => {
  const row: Color[] = [];
  // Aliases. Don't use in code.
  // @ts-ignore
  const size = palette_size;
  // @ts-ignore
  const l = lightness_equation;
  // @ts-ignore
  const c = chroma_equation;
  // @ts-ignore
  const h = hue_equation;

  for (let x = 0; x < palette_size; x++) {
    // @ts-ignore
    const i = x / (palette_size - 1);
    const lightness_value = eval(lightness_equation);
    const chroma_value = eval(chroma_equation);
    const hue_value = eval(hue_equation);

    row.push(
      new Color("oklch", [lightness_value, chroma_value, hue_value])
        .to("sRGB")
        .toGamut({ space: "sRGB" }),
    );
  }

  return row;
};

export const create_palette_row_element = (row: Color[]) => {
  const container_element = document.createElement("div");

  row.forEach((color) => {
    const color_string = color.toString({ format: "hex" });
    const color_element = document.createElement("div");
    color_element.classList.add("color");
    color_element.style.background = color_string;
    color_element.innerText = color_string;
    const text_color = new Color(color);
    text_color.oklch.l =
      (text_color.oklch.l + (text_color.oklch.l < 0.6 ? 0.4 : 0.6)) % 1;
    color_element.style.color = text_color.toString({ format: "hex" });
    container_element.append(color_element);
  });

  container_element.classList.add("color-row");

  return container_element;
};

export const update_preview = () => {
  const palette_size = parseInt(palette_size_element.value);
  const lightness_equation = lightness_equation_element.value;
  const chroma_equation = chroma_equation_element.value;
  const hue_equation = hue_equation_element.value;

  const row = create_palette_row(
    palette_size,
    lightness_equation,
    chroma_equation,
    hue_equation,
  );

  current_row = row;

  preview_container_element.innerHTML = "";

  preview_container_element.append(create_palette_row_element(row));
};

update_preview_on_change(palette_size_element);
update_preview_on_change(lightness_equation_element);
update_preview_on_change(chroma_equation_element);
update_preview_on_change(hue_equation_element);

update_preview();

const update_palette = () => {
  palette_container_element.innerHTML = "";
  palette.reverse().forEach((row) => {
    const row_element = create_palette_row_element(row);
    palette_container_element.append(row_element);
  });
};

add_colors_element.addEventListener("click", () => {
  palette.push(current_row);
  update_palette();
});
